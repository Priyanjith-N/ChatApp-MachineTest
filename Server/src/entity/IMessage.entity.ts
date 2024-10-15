export interface IMessage {
    chatId: string;
    senderId: string;
    content: string;
    type: "text" | "image" | "video" | "document";
    fileUrl?: string;
    isRead: boolean;
    timestamp: Date;
}