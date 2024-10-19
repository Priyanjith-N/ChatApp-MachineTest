import { isObjectIdOrHexString } from "mongoose";

// interfaces
import { IUserProfile } from "../entity/IUser.entity";
import IUserRepositroy from "../interface/repositories/user.repository";
import IUserUseCase from "../interface/usecase/IUser.usecase";
import { IMessage, IMessageCredentials, IMessagesAndChatData, IMessagesGroupedByDate, IMessageWithSenderDetails } from "../entity/IMessage.entity";

// errrors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import { IChat, IChatWithParticipantDetails } from "../entity/IChat.entity";
import ChatError from "../errors/chatError.error";

// socket
import emitSocketEvent from "../server";

// enums
import { ChatEventEnum } from "../constants/socketEvents.constants";
import { StatusCodes } from "../enums/statusCode.enum";
import { ErrorMessage } from "../enums/errorMesaage.enum";
import { ErrorField } from "../enums/errorField.enum";

export default class UserUseCase implements IUserUseCase {
    private userRepository: IUserRepositroy;

    constructor(userRepository: IUserRepositroy) {
        this.userRepository = userRepository;
    }

    async getUserProfile(id: string | undefined): Promise<IUserProfile | never> {
        try {
            if(!id || !isObjectIdOrHexString(id)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            const userProfile: IUserProfile | null = await this.userRepository.getUserProfile(id);

            if(!userProfile) throw new RequiredCredentialsNotGiven(ErrorMessage.INVALID_USER);

            return userProfile;
        } catch (err: any) {
            throw err;
        }
    }

    async handelLogout(id: string | undefined): Promise<void> {
        try {
            if(!id || !isObjectIdOrHexString(id)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            await this.userRepository.changeUserStatus(id, "offline");
        } catch (err: any) {
            throw err;
        }
    }

    async getAllUser(id: string | undefined): Promise<IUserProfile[]> {
        try {
            if(!id || !isObjectIdOrHexString(id)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);
            
            return await this.userRepository.getAllUsers(id);
        } catch (err: any) {
            throw err;
        }
    }

    async createNewChat(senderId: string | undefined, reciverId: string | undefined): Promise<IChatWithParticipantDetails | never> {
        try {
            if(!senderId || !isObjectIdOrHexString(senderId) || !reciverId || !isObjectIdOrHexString(reciverId) || senderId === reciverId) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            const chat: IChatWithParticipantDetails | undefined = await this.userRepository.isChatExisit(senderId, reciverId);

            if(chat) return chat;

            const newChat: IChat = await this.userRepository.createNewChat(senderId, reciverId);

            const createdChat: IChatWithParticipantDetails = await this.userRepository.getChatByIdWithParticipantDetails(newChat._id, senderId);

            emitSocketEvent<IChatWithParticipantDetails>(reciverId, ChatEventEnum.NEW_CHAT_EVENT, createdChat);

            return createdChat;
        } catch (err: any) {
            throw err;
        }
    }

    async getAllChatsOfCurrentUser(_id: string | undefined): Promise<IChatWithParticipantDetails[] | never> {
        try {
            if(!_id || !isObjectIdOrHexString(_id)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            return await this.userRepository.getAllChatsOfCurrentUser(_id);
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMessageOfChat(chatId: string | undefined, _id: string | undefined): Promise<IMessagesAndChatData | never> {
        try {
            if(!_id || !isObjectIdOrHexString(_id)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            if(!chatId || !isObjectIdOrHexString(chatId)) throw new ChatError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.INVALID_CHAT, type: ErrorField.CHAT });

            const chat: IChatWithParticipantDetails = await this.userRepository.getChatByChatIdAndUserId(chatId, _id);

            if(!chat) throw new ChatError({ statusCode: StatusCodes.NotFound, message: ErrorMessage.CHAT_NOT_FOUND, type: ErrorField.CHAT });

            const messages: IMessagesGroupedByDate[] = await this.userRepository.getAllMessagesWithChatId(chatId);

            const data: IMessagesAndChatData = {
                chat,
                messages
            }

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async sendMessage(chatId: string | undefined, senderId: string | undefined, content: string | undefined, type: string | undefined): Promise<IMessageWithSenderDetails | never> {
        try {
            if(!senderId || !isObjectIdOrHexString(senderId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            if(!chatId || !isObjectIdOrHexString(chatId)) throw new ChatError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.INVALID_CHAT, type: ErrorField.CHAT });

            if(!content || !type || ((type !== "text") && (type !== "image") && (type !== "video") && (type !== "document"))) throw new ChatError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.INVALID_MESSAGE, type: ErrorField.MESSAGE });

            const chat: IChatWithParticipantDetails = await this.userRepository.getChatByChatIdAndUserId(chatId, senderId);

            
            
            if(!chat) throw new ChatError({ statusCode: StatusCodes.NotFound, message: ErrorMessage.CHAT_NOT_FOUND, type: ErrorField.CHAT });
            
            const messageCredentials: IMessageCredentials = {
                chatId,
                content,
                senderId,
                type
            }
            
            const newMessage: IMessage = await this.userRepository.createNewMessage(messageCredentials);
            
            const createdMessage: IMessageWithSenderDetails = await this.userRepository.getMessageById(newMessage._id);
            
            await this.userRepository.updateLastMessageOfChat(chat.chatId, createdMessage._id); // update last message
            
            const updatedChat: IChatWithParticipantDetails = await this.userRepository.getChatByChatIdAndUserId(chat.chatId, senderId);

            chat.participants.forEach((userId) => {
                emitSocketEvent<IChatWithParticipantDetails>(userId.toString(), ChatEventEnum.NEW_CHAT_EVENT, updatedChat);
                if(userId.toString() !== senderId) {
                    emitSocketEvent<IMessageWithSenderDetails>(userId.toString(), ChatEventEnum.MESSAGE_RECEIVED_EVENT, createdMessage);
                }
            });

            return createdMessage;
        } catch (err: any) {
            throw err;
        }
    }
}