import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const ConnectDB = async () =>{
  try{
    const connectionLine = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log(`/n mongodb connected , DB host: ${connectionLine.connection.host}`)
  }
  catch(error){
  console.log("mongodb connection ",error)
  process.exit(1)
  }
}
export default ConnectDB

//creation of database is done and also imported