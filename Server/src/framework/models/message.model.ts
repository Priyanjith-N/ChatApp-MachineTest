import mongoose, { Schema } from "mongoose";
import { IMessage } from "../../entity/IMessage.entity";

const MessageSchema: Schema = new Schema(
    {
        chatId: { 
            type: Schema.Types.ObjectId, 
            required: true 
        },
        senderId: { 
            type: Schema.Types.ObjectId, 
            required: true 
        },
        content: { 
            type: String
        },
        file: {
            key: {
                type: String
            },
            url: {
                type: String
            }
        },
        type: { 
            type: String, 
            enum: ['text', 'image', 'video', 'document'],
            required: true
        },
        messageReadedParticipants: [
            { 
                type: Schema.Types.ObjectId, 
                required: true 
            }
        ],
        isRead: { 
            type: Boolean,
            default: false,
            required: true 
        },
        createdAt: { 
            type: Date,
            required: true
        }
    },
    { 
        timestamps: true
    }
);

const Messages = mongoose.model<IMessage>('Messages', MessageSchema);

export default Messages;