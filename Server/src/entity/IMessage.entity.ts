export interface IMessage {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: "text" | "image" | "video" | "document";
    fileUrl?: string;
    isRead: boolean;
    timestamp: Date;
}