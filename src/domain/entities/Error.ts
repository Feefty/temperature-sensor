export class AppError extends Error {
    code: number;

    constructor(message: string, code: number = 400) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
