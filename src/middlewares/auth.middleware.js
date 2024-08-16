import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
  
// since res is not used can describe it as (_)
export const verifyJWT = asyncHandler(async (req,_,next) =>{
    try{
        //if in mobile dev then it wont have accessToken then use header just to get the token
        //to get access of token use req have cookie access through cookieparser
   const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
console.log(token+"---------")
   if(!token){
    throw new ApiError(401,"unAuthorized request")
   }
   const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   const user = await User.findById(decodedToken?._id).select("-password refreshToken")

    req.user = user
    next()
    }
    catch(error){
       throw new ApiError(401,error?.message || "Invalid Token")
    }
})

