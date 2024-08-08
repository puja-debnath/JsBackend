import {v2 as cloudinary}  from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UploadOnCloudinary = async (LocalPath) =>{
    try{ 
        if(!LocalPath) return null
        //upload the file on cloudinary
      const response = await cloudinary.uploader.upload(LocalPath,
        {
            resource_type:"auto" // to accpet any kind pf filetype
        }
       )
       console.log("file is uploaded successfullly", response.url)
       fs.unlinkSync(LocalPath)
       return response 
    }
       catch(error){
        // now what if the file is uploaded on cloudinary but it wasnt uploaded on server then we have to delete
        //  the file otherwise it will saves as garbage so just unlink 
          fs.unlinkSync(LocalPath)
          return null 
       }
     
}

export {UploadOnCloudinary}