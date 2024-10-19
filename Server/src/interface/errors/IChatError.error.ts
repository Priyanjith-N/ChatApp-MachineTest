export interface IChatErrorDetails {
    statusCode: number;
    message: string;
    type: "Chat Error" | "Message Error";
}