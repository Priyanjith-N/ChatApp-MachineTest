import { isObjectIdOrHexString } from "mongoose";

// interfaces
import { IUserProfile } from "../entity/IUser.entity";
import IUserRepositroy from "../interface/repositories/user.repository";
import IUserUseCase from "../interface/usecase/IUser.usecase";

// errrors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import { IChat, IChatWithParticipantDetails } from "../entity/IChat.entity";
import { ChatEventEnum } from "../constants/socketEvents.constants";

// socket
import emitSocketEvent from "../server";

export default class UserUseCase implements IUserUseCase {
    private userRepository: IUserRepositroy;

    constructor(userRepository: IUserRepositroy) {
        this.userRepository = userRepository;
    }

    async getUserProfile(id: string | undefined): Promise<IUserProfile | never> {
        try {
            if(!id || !isObjectIdOrHexString(id)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const userProfile: IUserProfile | null = await this.userRepository.getUserProfile(id);

            if(!userProfile) throw new RequiredCredentialsNotGiven('Invaild user.');

            return userProfile;
        } catch (err: any) {
            throw err;
        }
    }

    async handelLogout(id: string | undefined): Promise<void> {
        try {
            if(!id || !isObjectIdOrHexString(id)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            await this.userRepository.changeUserStatus(id, "offline");
        } catch (err: any) {
            throw err;
        }
    }

    async getAllUser(id: string | undefined): Promise<IUserProfile[]> {
        try {
            if(!id || !isObjectIdOrHexString(id)) throw new RequiredCredentialsNotGiven('Provide all required details.');
            
            return await this.userRepository.getAllUsers(id);
        } catch (err: any) {
            throw err;
        }
    }

    async createNewChat(senderId: string | undefined, reciverId: string | undefined): Promise<IChatWithParticipantDetails | never> {
        try {
            if(!senderId || !isObjectIdOrHexString(senderId) || !reciverId || !isObjectIdOrHexString(reciverId) || senderId === reciverId) throw new RequiredCredentialsNotGiven('Provide all required details.');

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
            if(!_id || !isObjectIdOrHexString(_id)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return await this.userRepository.getAllChatsOfCurrentUser(_id);
        } catch (err: any) {
            throw err;
        }
    }
}