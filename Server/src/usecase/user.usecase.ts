import { isObjectIdOrHexString } from "mongoose";

// interfaces
import { IUserProfile } from "../entity/IUser.entity";
import IUserRepositroy from "../interface/repositories/user.repository";
import IUserUseCase from "../interface/usecase/IUser.usecase";
import { IMessage, IMessageCredentials, IMessagesAndChatData, IMessagesGroupedByDate, IMessageWithSenderDetails } from "../entity/IMessage.entity";

// errrors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import { IChat, IChatWithParticipantDetails, ILeaveGroup, JoinChatMessageRead } from "../entity/IChat.entity";
import ChatError from "../errors/chatError.error";

// socket

// enums
import { ChatEventEnum } from "../constants/socketEvents.constants";
import { StatusCodes } from "../enums/statusCode.enum";
import { ErrorMessage } from "../enums/errorMesaage.enum";
import { ErrorField } from "../enums/errorField.enum";
import { emitSocketEvent, isReciverInChat } from "../server";

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

            const isRead: boolean = await this.userRepository.makeMessageAsRead(chat.chatId, _id, chat.participants.length); // make all the message for the current user as read

            const updatedChat: IChatWithParticipantDetails = await this.userRepository.getChatByChatIdAndUserId(chat.chatId, _id); // if all of them read last message it should be send to front end

            if(isRead) {
                chat.participants.forEach((userId) => {
                    if(userId.toString() !== _id) {
                        emitSocketEvent<JoinChatMessageRead>(userId.toString(), ChatEventEnum.MESSAGE_READ_EVENT, { updatedChat, messageReadedUserId: _id });
                    }
                });
            }

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

    async sendMessage(chatId: string | undefined, senderId: string | undefined, content: string | undefined, type: string | undefined, file: Express.MulterS3.File | undefined): Promise<IMessageWithSenderDetails | never> {
        try {
            if(!senderId || !isObjectIdOrHexString(senderId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            if(!chatId || !isObjectIdOrHexString(chatId)) throw new ChatError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.INVALID_CHAT, type: ErrorField.CHAT });

            if((!content && !file) || !type || ((type !== "text") && (type !== "image") && (type !== "video") && (type !== "document") && (type !== "audio") && (type !== "voiceRecord"))) throw new ChatError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.INVALID_MESSAGE, type: ErrorField.MESSAGE });

            const chat: IChatWithParticipantDetails = await this.userRepository.getChatByChatIdAndUserId(chatId, senderId);
            
            if(!chat) throw new ChatError({ statusCode: StatusCodes.NotFound, message: ErrorMessage.CHAT_NOT_FOUND, type: ErrorField.CHAT });

            let isRead: boolean = true;

            const messageReadedParticipants: string[] = [];

            for(const userId of chat.participants) {
                if(!isReciverInChat(chat.chatId.toString(), userId.toString())) {
                    isRead = false;
                    continue;
                }

                messageReadedParticipants.push(userId);
            }
            
            
            const messageCredentials: IMessageCredentials = {
                chatId,
                senderId,
                type,
                messageReadedParticipants,
                isRead,
                createdAt: new Date(Date.now()),
            }

            if(content) { // if text message this
                messageCredentials.content = content;
            }else{ // if muiltimedia this
                messageCredentials.file = {
                    key: file!.key,
                    url: file!.location
                }
            }
            
            const newMessage: IMessage = await this.userRepository.createNewMessage(messageCredentials);
            
            const createdMessage: IMessageWithSenderDetails = await this.userRepository.getMessageById(newMessage._id);
            
            await this.userRepository.updateLastMessageOfChat(chat.chatId, createdMessage._id); // update last message
            
            const updatedChat: IChatWithParticipantDetails = await this.userRepository.getChatByChatIdAndUserId(chat.chatId, senderId); // this chat updates the current user

            for(const userId of chat.participants) {
                if(userId.toString() !== senderId) {
                    const chatToBeEmittedToReciver: IChatWithParticipantDetails = await this.userRepository.getChatByChatIdAndUserId(chat.chatId, userId.toString()); // this chat updates the reciver user

                    emitSocketEvent<IChatWithParticipantDetails>(userId.toString(), ChatEventEnum.NEW_CHAT_EVENT, chatToBeEmittedToReciver); // every reciver gets the reverchat

                    emitSocketEvent<IMessageWithSenderDetails>(userId.toString(), ChatEventEnum.MESSAGE_RECEIVED_EVENT, createdMessage);
                }else{
                    emitSocketEvent<IChatWithParticipantDetails>(userId.toString(), ChatEventEnum.NEW_CHAT_EVENT, updatedChat); // for current user chat update and message is updated form front-end
                }
            }

            return createdMessage;
        } catch (err: any) {
            throw err;
        }
    }

    async createNewGroupChat(groupName: string | undefined, participants: string[] | undefined, groupAdmin: string | undefined): Promise<IChatWithParticipantDetails | never> {
        try {
            if(!groupName || !participants || !groupAdmin || !isObjectIdOrHexString(groupAdmin)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            participants.push(groupAdmin); // should include the user creating the group.

            const newChat: IChat = await this.userRepository.createNewGroupChat(groupName, participants, groupAdmin);

            const createdChat: IChatWithParticipantDetails = await this.userRepository.getChatByIdWithParticipantDetails(newChat._id, groupAdmin);
            
            createdChat.participants.forEach((userId) => {
                if(userId.toString() !== groupAdmin) {
                    emitSocketEvent<IChatWithParticipantDetails>(userId.toString(), ChatEventEnum.NEW_CHAT_EVENT, createdChat);
                }
            });

            return createdChat;
        } catch (err: any) {
            throw err;
        }
    }

    async leaveGroupChat(userId: string | undefined, chatId: string | undefined): Promise<void | never> {
        try {
            if(!userId || !isObjectIdOrHexString(userId) || !chatId || !isObjectIdOrHexString(chatId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            const chat: IChatWithParticipantDetails = await this.userRepository.getChatByChatIdAndUserId(chatId, userId);

            if(!chat || chat.type !== "group") throw new ChatError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.INVALID_CHAT, type: ErrorField.CHAT });

            await this.userRepository.leaveGroupChat(chat.chatId, userId); // make user leave the chat

            emitSocketEvent<string>(userId, ChatEventEnum.DELETE_LEAVED_GROUP_EVENT, chat.chatId); // delete that group for the current user's ui

            chat.participants.forEach((participantId) => {
                if(participantId.toString() !== userId) {
                    emitSocketEvent<ILeaveGroup>(participantId.toString(), ChatEventEnum.USER_LEFT_THE_GROUP_EVENT, { chatId: chat.chatId, leavedUserId: userId });
                }
            })
        } catch (err: any) {
            throw err;
        }
    }

    async getAllUsersNotPresentInCurrentGroupChat(chatId: string | undefined, userId: string | undefined): Promise<IUserProfile[] | never> {
        try {
            if(!userId || !isObjectIdOrHexString(userId) || !chatId || !isObjectIdOrHexString(chatId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN);

            const chat: IChatWithParticipantDetails = await this.userRepository.getChatByChatIdAndUserId(chatId, userId);

            if(!chat || chat.type !== "group") throw new ChatError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.INVALID_CHAT, type: ErrorField.CHAT });

            return await this.userRepository.getAllUsersNotPresentInGivenChat(chat.participants);
        } catch (err: any) {
            throw err;
        }
    }
}