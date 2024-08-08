import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {UploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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
    //console.log("email:-----", email)

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

      const avatarLocalPath = req.files?.avatar[0]?.path
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
  

export {registerUser}