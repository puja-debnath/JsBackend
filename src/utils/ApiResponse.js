class ApiResponse{
    constructor(data, statusCode, message = "success"){
        this.statusCode = statusCode,
        this.data = data,
        this.success = statusCode < 400 ,
        this.message = message
    }
}

export {ApiResponse}