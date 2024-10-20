// interfaces
import { IMessage, IMessagesGroupedByDate, IMessageWithSenderDetails } from "./message.entity";
import { IUserProfile } from "./user.entity";


export interface IChat {
    _id: string;
    chatId: string;
    participants: string[]; // User IDs
    type: "one-to-one" | "group";
    groupName?: string;
    groupProfilePicture?: string;
    groupAdmin?: string;
    lastMessage: string;
    createdAt: Date;
}

export interface IChatWithParticipantDetails extends IChat {
    participantsData: IUserProfile[];
    lastMessageData: IMessage;
    unReadMessages: number;
}

export interface IMessagesAndChatData {
    messages: IMessagesGroupedByDate[];
    chat: IChatWithParticipantDetails;
}