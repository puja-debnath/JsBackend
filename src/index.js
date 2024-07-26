//require("dotenv").config({path:"./env"})   although it is fine 
// here using require break the consistency of the code so add configure for all env in dev script
//  it will load the env first and will be accesseble anywhere
import dotenv from "dotenv"
import ConnectDB from "./db/index.js"
dotenv.config({
    path:"./env"
})

ConnectDB()





// (async() =>{
//      try{
//        mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//        app.on((error) =>{
//         console.log("error", error)
//         throw error
//        })

//        app.listen(process.env.PORT,() =>{
//           console.log(`App is listening on ${process.env.PORT}`)
//        })
//      }catch(error){
//         console.log("error:", error)
//         throw err
//      }
// })()

//everything is here ,   for readbility separate them in db  