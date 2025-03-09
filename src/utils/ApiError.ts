class ApiError extends Error{
    public statusCode: number;
    public message: string;
    public data: unknown | null;
    public errors: string | null;
    public success: boolean;

    constructor(statusCode: number, message: string = "Something went wrong", errors: string[] = [], stack?:string){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.errors = errors.length ? errors.join(", ") : null;
        this.success = false;

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };