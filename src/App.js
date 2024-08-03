import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
// to access the user browser cookies and seet them form my server to perform CURD operation
const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true ,
}))


// major configuraions 
app.use(express.json({limit:'16kb'}))  // to limit data
app.use(express.static("public")) // to store pdf file etc
app.use(express.urlencoded({extended:true, limit:"16kb"}))  // to handle upcoming URL
app.use(cookieparser())

//import Routes here
import userRouter from "./Routes/user.routes.js"
//sincer routers are in another file we havve to use middleware to use route


//http://localhost:3000/users/register
app.use("/api/v1/users",userRouter)






export default app