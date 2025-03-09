class ApiResponse{
    public statusCode: number;
    public message: string;
    public data: unknown | null;
    public success: boolean;

    constructor(statusCode: number, message: string = "Success", data: unknown | null = null){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };