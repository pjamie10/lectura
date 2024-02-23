export interface MessageStatusResponse {
    code: string;
    message: string;
}
export interface StatusResponseBase {
    success: boolean;
    code: string;
    message: string;
    validations?: MessageStatusResponse[];
}
export interface StatusResponse<T> extends StatusResponseBase {
    data: T;
}
export declare const EmptyArrayResponse: StatusResponse<any[]>;
export declare const EmptyStringResponse: StatusResponse<string>;
export declare const EmptyNullResponse: StatusResponse<any>;
