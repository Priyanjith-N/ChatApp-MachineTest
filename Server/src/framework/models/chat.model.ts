import mongoose, { Schema } from "mongoose";

// interfaces
import { IChat } from "../../entity/IChat.entity";

const ChatSchema: Schema = new Schema(
    {
        chatId: { 
            type: Schema.Types.ObjectId, 
            required: true, 
            unique: true
        },
        participants: [
            { 
                type: Schema.Types.ObjectId, 
                required: true 
            }
        ],
        type: { 
            type: String, 
            enum: ["one-to-one", "group"], 
            required: true 
        },
        groupName: { 
            type: String
        },
        groupProfilePicture: {
            type: String
        },
        lastMessage: {
            type: Schema.Types.ObjectId,
            default: null
        },
        groupAdmin: {
            type: Schema.Types.ObjectId
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

const Chats = mongoose.model<IChat>("Chats", ChatSchema);

export default Chats;