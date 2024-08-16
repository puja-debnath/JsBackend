class ApiError extends Error{
    constructor(
       statusCode,
       message="something went WRONG",
       errors=[], // if there are multiple error use array
      // The stack property contains a stack trace of the error,
       // which is useful for debugging. It shows the sequence of function calls that led to the error,
       stack= ""
    ){
        super(message)  //  which we want to override
        this.statusCode = statusCode,
        this.success = false,
        this.data = null,
        this.message = message,
        this.errors = errors


        //to find in which file there is error 
        if(stack){
           this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}