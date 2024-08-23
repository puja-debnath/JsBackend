import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const ConnectDB = async () =>{
  try{
    const connectionLine = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log(`/n mongodb connected , DB host: ${connectionLine.connection.host}`)
  }
  catch(error){
  console.log("mongodb connection aborted ",error)
  process.exit(1)
  }
}
export default ConnectDB


//creation of database is done and also imported

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

