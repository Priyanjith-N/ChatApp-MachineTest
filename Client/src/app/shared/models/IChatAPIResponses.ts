// interfaces
import { IChatWithParticipantDetails } from "./IChat.entity";

export interface ICreateNewChatSuccessfullAPIResponse {
    message: string;
    data: IChatWithParticipantDetails;
}

export interface IGetAllChatsSuccessfullAPIResponse {
    message: string;
    data: IChatWithParticipantDetails[];
}