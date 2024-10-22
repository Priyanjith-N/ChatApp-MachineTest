import { IUserProfile } from "./user.entity";

export interface IMessage {
    _id: string;
    chatId: string;
    senderId: string;
    content?: string;
    file?: {
        key: string,
        url: string
    };
    type: "text" | "image" | "video" | "document";
    isRead: boolean;
    createdAt: Date;
}

export interface IMessageWithSenderDetails extends IMessage {
    senderData: IUserProfile;
}

export interface IMessagesGroupedByDate {
    createdAt: Date;
    messages: IMessageWithSenderDetails[];
}