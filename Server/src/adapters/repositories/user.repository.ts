// importing collections
import Users from "../../framework/models/user.models";
import Chats from "../../framework/models/chat.model";

// interfaces
import IUserRepositroy from "../../interface/repositories/user.repository";
import { IUserProfile } from "../../entity/IUser.entity";
import { IChat, IChatWithParticipantDetails } from "../../entity/IChat.entity";
import mongoose from "mongoose";

export default class UserRepository implements IUserRepositroy {
    private commonAggratePiplineForChat() {
        return [
            {
                $lookup: {
                  from: 'users', 
                  localField: 'participants', 
                  foreignField: '_id', 
                  as: 'participantsData'
                }
            },
            {
                $project: {
                    "participantsData.password": 0
                }
            }
        ]
    }

    async getUserProfile(id: string): Promise<IUserProfile | null | never> {
        try {
            return await Users.findOne({ _id: id }, { password: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async changeUserStatus(_id: string, status: "online" | "offline"): Promise<void> {
        try {
            await Users.updateOne({ _id }, { $set: { status } });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllUsers(_id: string): Promise<IUserProfile[]> {
        try {
            return await Users.find({ _id: { $ne: _id } }, { password: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async isChatExisit(senderId: string, reciverId: string): Promise<IChatWithParticipantDetails | undefined | never> {
        try {
            const chat: IChatWithParticipantDetails[] = await Chats.aggregate([
                {
                    $match: {
                        type: "one-to-one",
                        $and: [
                            {
                                participants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(senderId) } },
                            },
                            {
                                participants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(reciverId) } },
                            }
                        ]
                    }
                },
                ...this.commonAggratePiplineForChat()
            ]);

            return chat[0];
        } catch (err: any) {
            throw err;
        }
    }

    async createNewChat(senderId: string, reciverId: string): Promise<IChat| never> {
        try {
            const newChat = new Chats({
                chatId: new mongoose.Types.ObjectId(),
                createdAt: new Date(Date.now()),
                participants: [senderId, reciverId],
                type: "one-to-one"
            });

            await newChat.save();

            return newChat;
        } catch (err: any) {
            throw err;
        }
    }

    async getChatByIdWithParticipantDetails(id: string, senderId: string): Promise<IChatWithParticipantDetails | never> {
        try {
            const chat: IChatWithParticipantDetails[] = await Chats.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                ...this.commonAggratePiplineForChat()
            ]);

            return chat[0];
        } catch (err: any) {
            throw err;
        }
    }
}