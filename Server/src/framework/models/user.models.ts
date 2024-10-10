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
        type: String,
        default: "https://photosqn.com/wp-content/uploads/2024/05/no-dp_16.webp",
        required: true
    },
    about: {
        type: String,
        default: "Hey there! I am using WhatsApp.",
        required: true
    },
    status: {
        type: String,
        default: "offline",
        required: true
    }
});

const Users = mongoose.model<IUser>('Users', userSchema);

export default Users;