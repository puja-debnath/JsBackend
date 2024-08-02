//require("dotenv").config({path:"./env"})   although it is fine 
// here using require break the consistency of the code so add configure for all env in dev script
//  it will load the env first and will be accesseble anywhere

import dotenv from "dotenv"
import ConnectDB from "./db/index.js"
import app from "./App.js"
dotenv.config({
    path:"./env"
})


//asynchronous always returs a promise 
ConnectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000,() =>{
        console.log(`App is listening on ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("mongo db connection failed !!!!" , error)
})





