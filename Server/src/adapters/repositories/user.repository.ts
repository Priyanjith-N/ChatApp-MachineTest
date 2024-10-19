import mongoose from "mongoose";

// importing collections
import Users from "../../framework/models/user.models";
import Chats from "../../framework/models/chat.model";
import Messages from "../../framework/models/message.model";

// interfaces
import IUserRepositroy from "../../interface/repositories/user.repository";
import { IUserProfile } from "../../entity/IUser.entity";
import { IChat, IChatWithParticipantDetails } from "../../entity/IChat.entity";
import { IMessage, IMessageCredentials, IMessagesGroupedByDate, IMessageWithSenderDetails } from "../../entity/IMessage.entity";

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
            },
            {
                $lookup: {
                    from: 'messages', 
                    localField: 'lastMessage', 
                    foreignField: '_id', 
                    as: 'lastMessageData'
                }
            }, 
            {
                $unwind: {
                    path: '$lastMessageData'
                }
            }
        ]
    }

    private commonAggratePiplineForMessage() {
        return [
            {
                $lookup: {
                  from: 'users', 
                  localField: 'senderId', 
                  foreignField: '_id', 
                  as: 'senderData'
                }
            },
            {
                $unwind: {
                    path: '$senderData'
                }
            },
            {
                $project: {
                    "senderData.password": 0
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

    async getAllChatsOfCurrentUser(_id: string): Promise<IChatWithParticipantDetails[] | never> {
        try {
            const chat: IChatWithParticipantDetails[] = await Chats.aggregate([
                {
                    $match: {
                        participants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(_id) } },
                        lastMessage: { $ne: null }
                    }
                },
                ...this.commonAggratePiplineForChat()
            ]);

            return chat;
        } catch (err: any) {
            throw err;
        }
    }

    async getChatByChatIdAndUserId(chatId: string, _id: string): Promise<IChatWithParticipantDetails | never> {
        try {
            const chat: IChatWithParticipantDetails[] = await Chats.aggregate([
                {
                    $match: {
                        participants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(_id) } },
                        chatId: new mongoose.Types.ObjectId(chatId)
                    }
                },
                ...this.commonAggratePiplineForChat()
            ]);

            return chat[0];
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMessagesWithChatId(chatId: string): Promise<IMessagesGroupedByDate[] | never> {
        try {
            return await Messages.aggregate([
                {
                    $match: {
                        chatId: new mongoose.Types.ObjectId(chatId)
                    }
                },
                ...this.commonAggratePiplineForMessage(), 
                {
                    $group: {
                      _id: {
                        day: {
                          $dayOfMonth: '$createdAt'
                        }, 
                        month: {
                          $dateToString: {
                            format: '%B', 
                            date: '$createdAt'
                          }
                        }, 
                        year: {
                          $year: '$createdAt'
                        }
                      }, 
                      createdAt: {
                        $first: '$createdAt'
                      }, 
                      messages: {
                        $push: '$$ROOT'
                      }
                    }
                }, 
                {
                    $project: {
                      _id: 0
                    }
                }
            ]);
        } catch (err: any) {
           throw err; 
        }
    }

    async createNewMessage(messageCredentials: IMessageCredentials): Promise<IMessage> {
        try {
            const newMessage = new Messages({
                chatId: messageCredentials.chatId,
                content: messageCredentials.content,
                createdAt: new Date(Date.now()),
                senderId: messageCredentials.senderId,
                type: messageCredentials.type
            });

            await newMessage.save();

            return newMessage;
        } catch (err: any) {
            throw err;
        }
    }

    async getMessageById(_id: string): Promise<IMessageWithSenderDetails | never> {
        try {
            const message: IMessageWithSenderDetails[] = await Messages.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(_id)
                    }
                },
                ...this.commonAggratePiplineForMessage()
            ]);

            return message[0];
        } catch (err: any) {
            throw err;
        }
    }

    async updateLastMessageOfChat(chatId: string, messageId: string): Promise<void> {
        await Chats.updateOne({ chatId }, { $set: { lastMessage: messageId } });
    }
}