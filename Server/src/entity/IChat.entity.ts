// interfaces
import { IMessage } from "./IMessage.entity";
import { IUserProfile } from "./IUser.entity";

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
    lastMessageData: IMessage;
    unReadMessages: number;
}

export interface JoinChatMessageRead {
    updatedChat: IChatWithParticipantDetails;
    messageReadedUserId: string;
}