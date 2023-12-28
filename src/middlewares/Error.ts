import {Request, Response, NextFunction } from "express"

interface CustomeError extends Error{
    statusCode?: number;
}
const errorMiddleware = (err: CustomeError, req:Request, res:Response, next:NextFunction) => {

    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;

    // console.log(err)
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}


export default errorMiddleware