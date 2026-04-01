export class ApiClientError extends Error {
    status : number;
    details: unknown;

    constructor(message : string , status = 500 , details?:unknown){
        super(message);
        this.name = "ApiClientError";
        this.status = status;
        this.details = details;
    }
}