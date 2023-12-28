import { Request, Response, NextFunction } from "express"

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// try catch errors will be handled here
// function will return another function
export const catchAsyncError = (passedFunction: AsyncFunction) => (req: Request, res:Response, next:NextFunction) => {

    Promise.resolve(passedFunction(req, res, next)).catch(next)

}