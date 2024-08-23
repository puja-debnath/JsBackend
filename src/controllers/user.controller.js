import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {UploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import fs from "fs"
import mongoose from "mongoose"

//to create tokens
const generateAccessAndRefreshToken = async(userId) =>{

    try{
        const user = await User.findById(userId)
        console.log(user)
        if(!user){
            throw new ApiError(400, "user not found")
        }
        const accessToken = user.generateAccessToken() // these are methods add ()
        const refreshToken = user.generateRefreshToken()
        //have to add the refreshtoken in user in db so that wont have to ask again again
        user.refreshToken = refreshToken
        //while saving mongoose whole model will kick in ,use ValidateBeforesave
        //dont check for validtion here(password not here so it will validate password absense,wil give error)
        await user.save({validateBeforeSave:false})
        return {
            accessToken,
            refreshToken
        }
    }
    catch(error){
        throw new ApiError(500,"something went wrong while generating Access and Refresh Token")
    }
}

const registerUser = asyncHandler(async (req,res) =>{
            //The ALGORITHM
    //get user details from fontend  here use user model
    //check validation, not empty
    //chexk if the user already exist -username , email
    //check for images, avater since required
    // upload the file in cloudinary 
    //create user object , create entry in db
    // remove password and refresh token field from response
    //check for user creation
    // return res

    
    //extracted all the data points
    const{fullName, email,username,password} = req.body
    // console.log("email:-----", email)

    // if(fullname === ""){
    //     throw new ApiError(400, "fullname is required")
    // }

    // checking empty details
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //checking exested user
    const existedUser = await User.findOne({
        $or:[{username},{email}]
   })
   
   if(existedUser){
       throw new ApiError(409,"username and email already existed")
   }

   //checking user image and coverimage
  // multer give req.files access to all files, using the multer middleware 
  //req.files?avatar constain so may properties file name,size,type we only need 1st
 
      const avatarLocalPath = req.files?.avatar[0]?.path  //req.files cause there are multiple files 
            if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
   }

     // const coverImgaeLocalPath = req.files?.coverImage[0]?.path
        //we dont know the coverimage exist or not so first check
   let coverImgaeLocalPath;

   if(req.files && Array.isArray(req.files.coverImage) && (req.files.coverImage.length > 0 )){
         coverImgaeLocalPath = req.files.coverImage[0].path
   }
              

  const avatar = await UploadOnCloudinary(avatarLocalPath)
  const coverImage = await UploadOnCloudinary(coverImgaeLocalPath)
         if(!avatar){
              throw new ApiError(400,"Avatar file is required")
             }

 //create entry in db 
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "", //since we dont knwo coverimge exist or not 
        email,
        password,
        username:username.toLowerCase()
    })

      // remove password and refresh token field from response
    // whatever you dont want to add put (-) infront of that
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
        //check for user creation
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

  // return response
     return res.status(201).json(
        new ApiResponse(200,createdUser,"user created successfully")
     )
})

const loginUser = asyncHandler(async (req,res) => {
    // req body -> data
    //username or email
    //find the user
    //pasword check
    //generate access and refresh token
    //send cookie

    const{username, email, password} = req.body

    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
 

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})
  
const logOutUser = asyncHandler(async (req,res) =>{
    
     await User.findByIdAndUpdate(
        req.user._id,
        { //what needs to be update
           $unset:{
            refreshToken:1  //this remove the field from the document
           }
        },
        {new : true} //return the  information after updation
      )

      const options = {
        httpOnly:true,
        secure:true
      }

      return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(200,"user logged out successfully"))

})

const refreshAccessToken = asyncHandler(async (req,res) =>{

     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
     if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized quest")
     }

    try {
         const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
         const user = await User.findById(decodedToken?._id)
         if(!user){
            throw new ApiError(401,"invalid refresh token")
         }
    
       if(incomingRefreshToken!==user?.refreshToken){
        throw new ApiError(401,"Refrsh token is used or expired")
       }
    
     //to add something in cookies add options
     const options = {
        httpOnly:true,
        secure:true
     }
    
     const {newRefreshToken,accessToken} =  await generateAccessAndRefreshToken(user._id)
    
         return res.
            status(200)
            .cookie("accessToken",options,accessToken)
            .cookie("refreshToken",options,newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    {accessToken,refreshToken:newRefreshToken},
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token") 
    }

})


const changeCurrentPassword = asyncHandler(async(req,res) =>{
         //req.cookies?.password || req.body?.password
    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user?._id)
    
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401,"user doesnot exist")
    }
    user.password = newPassword // password is changed , now save it 
    await user.save({validateBeforeSave:false}) //since it ocming from db use await, {} for not change anything 
    
    return res
    .status(200)
    .json(new ApiResponse(200,{},"password updated successfully"))

})

const getCurrentUser = asyncHandler(async (req,res) =>{
    console.log(req.user+"-----------------")
   return res
         .status(200)
         .json(200,req.user,"current user fetched successfully")
  
})

const updateAccountDetails = asyncHandler(async (req,res) =>{
     //to update any file always create different files and end points
     const{fullName,email} = req.body
     if(!(fullName || email)){
        throw new ApiError(401,"All the fields are reuqired")
     }
    const user =  await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email //both are right way to write email:newemail
            }
        },
        {new:true}
     ).select("-password")

     return res
     .status(200)
     .json(
       new ApiResponse(200,user,"Account details updated successfully")
     )

})

const updateUserAvatar = asyncHandler(async(req,res) =>{

     const avatarLocalPath  =   req.file?.path
     if(!avatarLocalPath){throw new ApiError(400,"avatar file is missing")}

     //delete the old file

     const avatar = await UploadOnCloudinary(avatarLocalPath)
     if(!avatar.url){throw new ApiError(400,"something went wrong while uploading on cloudinary")}

     const user = await User.findByIdAndUpdate(
        req.user?._id,{
            $set:{
                avatar:avatar.url  //since we only need to change the avatar 
            }
        },{new:true}
     ).select("-password")
   
     return res
     .status(200)
     .json(new ApiResponse(200,user,"avatar updated successfully"))

})

const updateUsercoverImage = asyncHandler(async(req,res) =>{
    const coverImageLocalPath  =   req.file?.path
    if(!coverImageLocalPath){throw new ApiError(400,"coverImage file is missing")}

    const coverImage = await UploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){throw new ApiError(400,"something went wrong while uploading coverImage on cloudinary")}

    const user = await User.findByIdAndUpdate(
       req.user?._id,{
           $set:{
            coverImage:coverImage.url  //since we only need to change the avatar 
           }
       },{new:true}
    ).select("-password")
  
    return res
    .status(200)
    .json(new ApiResponse(200,user,"coverImage updated successfully"))

})

const getUserChannelprofile = asyncHandler(async(req,res) =>{
    const {username} = req.params
    if(!username?.trim()){ // in case of undefined it will pass, use trim to add this case in this error
        throw new ApiError(400,"username doesnot exist")
    }

    // aggrigate pipeline it takes array {} (these are different pipelines)
  const  channel = await User.aggregate([

    //finding out which channel user is subscribed
    {
        $match:{
            username:username?.toLowerCase()  //chai aur code now have to find subscriber 
        }
    },

    //how many subscribers exist to this particular username
    {
        $lookup:{
            from:"subscription",//name of collection to join,db automatically convert collection to lowercase
            localField:"_id",
            foreignField:"channel",
            as:"subscribers" //name of the output array
        }
    },

    //how many i subscribed
    {
        $lookup:{
            from:"subscription",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo "
        }
    },

    //adding addional fields
    {
        $addFields:{
            subscribersCount:{
                $size:"$subscribers" //since its a field add $
            },
            channelsSubscribedToCount:{
                $size:"subscribedTo"
            },
            isSubscribed:{
                $cond:{
                    //$in calculate both array and object
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]}
                }
            }
        }
    },
    //only these selected fileds we want to pass formard
    {
        $project:{
            fullName: 1,
            username: 1,
            subscribersCount: 1,
            channelsSubscribedToCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1
        }
    }
   ])

   if(!channel?.length){
    throw new ApiError("401","channel does not exist")
   }

   return res
   .status(200)
   .json(new ApiResponse(200,channel[0],"user channel fetched successfully"))
})

const watchHistory = asyncHandler(async (req,res)=>{
    //in mongo id are stores as string,then mongoose help to translate into number handle everything
    const user =  User.aggregate([
        {
            $match:{
                //inside pipeline mongoose doesnot work , it take everything as it is 
                _id: mongoose.Types.ObjectId(req.user?._id) // it create a new id without using the new keyword
    
            }
        },
        {
            $lookup:{
                from: "videos" ,  //
                localField:watchHistory ,
                foreignField : _id ,
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"user",
                            localField: "owner",
                            foreignField:"_id",
                            as :"Owners",
                             pipeline:[
                                {
                                    $project:{
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                             ]
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200, user[0].watchHistory,"watcched history fetched successfully"))
})



export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUsercoverImage,
    getUserChannelprofile,
    watchHistory
}