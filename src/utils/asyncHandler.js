const asyncHandler = (RequestHandler) => {
    (req,res,next) =>{
              Promise.resolve(RequestHandler(req,res,next))
              .catch((error) =>next(error))
    }

}

export {asyncHandler}


//const asyncHandler = () => async{() => {}}   higher order function 


// its a wrapper function that we will use everywhere
// here we are usig try/catch methood
// const asyncHandler = (fn) => async (req,res,next) =>{
//    try{
//     await fn(reeq,res,next)
//    }
//    catch(error){
//     res.status(error.code || 500).json({
//         success:false,
//         message:error.message
//     })
//    }
// }
