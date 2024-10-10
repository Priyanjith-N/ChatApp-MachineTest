export default interface IUser {
    _id: string;
    userName: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    password: string;
    profilePicture: string;
    about: string;
    status: "online" | "offline";
}

export interface IUserLoginCredentials {
    identifier: string | undefined;
    password: string | undefined;
}