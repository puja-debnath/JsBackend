class ApiError extends Error{
    constructor(
       statusCode,
       message="something went WRONG",
       errors=[], // if there are multiple error use array
       statck= ""
    ){
        super(message)  //  which we want to override
        this.statusCode = statusCode,
        this.success = false,
        this.data = null,
        this.message = message,
        this.errors = errors


        //to find in which file there is error 
        if(statck){
           this.stack = statck
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}