import { NextFunction, Response, Request } from "express";
import { ZodError } from "zod";
import { AppError } from "../../../domain/entities/Error";


export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Validation Error",
            details: err.flatten().fieldErrors
        });
    }

    if (err instanceof AppError) {
        return res.status(err.code).json({
            error: err.name,
            message: err.message
        });
    }

    console.error("Unhandled server error:", err);
    res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred"
    });
}