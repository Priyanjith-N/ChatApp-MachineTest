// interfaces
import { IChatWithParticipantDetails, IMessagesAndChatData } from "./IChat.entity";
import { IMessageWithSenderDetails } from "./message.entity";
import { IUserProfile } from "./user.entity";

export interface ICreateNewChatSuccessfullAPIResponse {
    message: string;
    data: IChatWithParticipantDetails;
}

export interface IGetAllChatsSuccessfullAPIResponse {
    message: string;
    data: IChatWithParticipantDetails[];
}

export interface IGetMessagessOfChatSuccessfullAPIResponse {
    message: string;
    data: IMessagesAndChatData;
}

export interface ISendMessageSuccessfullAPIResponse {
    message: string;
    data: IMessageWithSenderDetails;
}

export interface ICreateNewGroupSuccessfullAPIResponse {
    message: string;
    data: IChatWithParticipantDetails;
}

export interface ILeaveGroupChatSuccessfullAPIResponse {
    message: string;
}

export interface IGetAllUsersNotPresentInCurrentGroupSuccessfullAPIResponse {
    message: string;
    data: IUserProfile[];
}

export interface IAddNewMembersInGroupSuccessfullAPIResponse {
    message: string;
}