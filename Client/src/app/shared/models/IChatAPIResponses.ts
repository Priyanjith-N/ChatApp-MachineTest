// interfaces
import { IChatWithParticipantDetails, IMessagesAndChatData } from "./IChat.entity";
import { IMessageWithSenderDetails } from "./message.entity";

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