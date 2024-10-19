import { IChatWithParticipantDetails } from "./IChat.entity";
import { IUserProfile } from "./IUser.entity";

export interface IMessage {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: "text" | "image" | "video" | "document";
    isRead: boolean;
    createdAt: Date;
}

export interface IMessageWithSenderDetails extends IMessage {
    senderData: IUserProfile;
}

export interface IMessagesAndChatData {
    messages: IMessageWithSenderDetails[];
    chat: IChatWithParticipantDetails;
}

export interface IMessageCredentials {
    chatId: string;
    senderId: string;
    content: string;
    type: "text" | "image" | "video" | "document";
}