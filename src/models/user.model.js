import mongoose , { Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
     username:{
        type: String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, //to make it more seachable in a optimized way
     },
     email:{
        type: String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type: String,
        require:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //clooudinary url
        required:true
    },
    coverImage:{
        type:String // cloudinary url
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    password:{
        type:String ,  // try to encrypt data gets leak
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String
    }
    
},
{
    timestamps:true
}
)  


// here dont use arrow callback cause  there is no this reference here, but we need the context here 
//its a pre hook
userSchema.pre("save", async function(next) {
    //if we dont use if then with every change it will update the password everytime
    if(!this.isModified("password")) return next()
      this.password =await bcrypt.hash(this.password,10)
    next()
})

 //now since the password is encrypted we have to check the password is correct or not 
 userSchema.methods.isPasswordCorrect = async function(password){
    console.log(password,"password.............")
    return await bcrypt.compare(password,this.password)
}


//we using both session and cookies for security 

//access and refresh are both JWT tokens
userSchema.methods.generateAccessToken = function(){
    //add the payload for tokens
  return jwt.sign({
     _id : this._id,
     email:this.email,
     username:this.username,
     fullName: this.fullName
   },
   process.env.ACCESS_TOKEN_SECRET,
   //access-token-expiry goes indie a object
   {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
   }
)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
       expiresIn:process.env.REFRESH_TOKEN_EXPIRY
      }
    )   
}


 export const User = mongoose.model("User", userSchema)
 

