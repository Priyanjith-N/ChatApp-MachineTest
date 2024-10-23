import mongoose, { Schema } from "mongoose";
import IUser from "../../entity/IUser.entity";

const userSchema: Schema = new Schema<IUser>({
    userName: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        key: {
            type: String,
            default: null,
        },
        url: {
            type: String,
            default: "https://chat-app-muiltimedia-file-storage.s3.ap-south-1.amazonaws.com/defaultImages/no-dp_16.webp",
            required: true
        }
    },
    about: {
        type: String,
        default: "Hey there! I am using Chat App.",
        required: true
    }
});

const Users = mongoose.model<IUser>('Users', userSchema);

export default Users;