// interfaces
import { IChat, IChatWithParticipantDetails } from "../../entity/IChat.entity";
import { IMessage, IMessageCredentials, IMessagesGroupedByDate, IMessageWithSenderDetails } from "../../entity/IMessage.entity";
import { IUserProfile } from "../../entity/IUser.entity";

export default interface IUserRepositroy {
    getUserProfile(id: string): Promise<IUserProfile | null | never>;
    changeUserStatus(_id: string, status: "online" | "offline"): Promise<void | never>;
    getAllUsers(_id: string): Promise<IUserProfile[] | never>;
    isChatExisit(senderId: string, reciverId: string): Promise<IChatWithParticipantDetails | undefined | never>;
    createNewChat(senderId: string, reciverId: string): Promise<IChat| never>;
    getChatByIdWithParticipantDetails(id: string, senderId: string): Promise<IChatWithParticipantDetails | never>;
    getAllChatsOfCurrentUser(_id: string): Promise<IChatWithParticipantDetails[] | never>;
    getChatByChatIdAndUserId(chatId: string, _id: string): Promise<IChatWithParticipantDetails | never>;
    getAllMessagesWithChatId(chatId: string): Promise<IMessagesGroupedByDate[] | never>;
    createNewMessage(messageCredentials: IMessageCredentials): Promise<IMessage | never>;
    getMessageById(_id: string): Promise<IMessageWithSenderDetails | never>;
    updateLastMessageOfChat(chatId: string, messageId: string): Promise<void | never>;
    makeMessageAsRead(chatId: string, reciverId: string): Promise<void | never>;
    createNewGroupChat(groupName: string, participants: string[], groupAdmin: string): Promise<IChat | never>;
}