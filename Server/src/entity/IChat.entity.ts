// interfaces
import { IMessage } from "./IMessage.entity";
import { IUserProfile } from "./IUser.entity";

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