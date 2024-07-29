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
export default app