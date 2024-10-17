// interfaces
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
}