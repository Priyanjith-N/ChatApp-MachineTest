import { IChatWithParticipantDetails } from "./IChat.entity";
import { IUserProfile } from "./IUser.entity";

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
    messageReadedParticipants: string[];
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

export interface IMessagesAndChatData {
    messages: IMessagesGroupedByDate[];
    chat: IChatWithParticipantDetails;
}

export interface IMessageCredentials {
    chatId: string;
    senderId: string;
    content?: string;
    file?: {
        key: string,
        url: string
    };
    type: "text" | "image" | "video" | "document";
    messageReadedParticipants: string[];
    isRead: boolean;
    createdAt: Date;
}