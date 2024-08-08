// The asyncHandler function you provided is a middleware function that helps handle asynchronous operations
//  in Express.js routes. It is a wrapper function that takes a request handler function as an argument and
//   returns a new function that can be used as a middleware in your Express.js application.

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next))
      .catch((err) => next(err))
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
