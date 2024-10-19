import { IUserProfile } from "./user.entity";

export interface IMessage {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: "text" | "image" | "video" | "document";
    fileUrl?: string;
    isRead: boolean;
    createdAt: Date;
}

export interface IMessageWithSenderDetails extends IMessage {
    senderData: IUserProfile;
}