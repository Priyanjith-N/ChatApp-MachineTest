// interfaces
import { IChatWithParticipantDetails } from "./IChat.entity";

export interface ICreateNewChatSuccessfullAPIResponse {
    message: string;
    data: IChatWithParticipantDetails;
}