// interfaces
import { IMessage, IMessagesGroupedByDate, IMessageWithSenderDetails } from "./message.entity";
import { IUserProfile } from "./user.entity";


export interface IChat {
    _id: string;
    chatId: string;
    participants: string[]; // User IDs
    pastParticipants: string[]; // User IDs of user who left or leave chat
    type: "one-to-one" | "group";
    groupName?: string;
    groupProfilePicture?: {
        key: string | null,
        url: string
    };
    groupAdmin?: string;
    lastMessage: string;
    createdAt: Date;
}

export interface IChatWithParticipantDetails extends IChat {
    participantsData: IUserProfile[];
    pastParticipantsData: IUserProfile[];
    lastMessageData: IMessage;
    unReadMessages: number;
}

export interface IMessagesAndChatData {
    messages: IMessagesGroupedByDate[];
    chat: IChatWithParticipantDetails;
}

export interface JoinChatMessageRead {
    updatedChat: IChatWithParticipantDetails;
    messageReadedUserId: string;
}

export interface ILeaveGroup {
    chatId: string;
    leavedUserId: string;
}