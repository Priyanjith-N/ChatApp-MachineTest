export default interface IUser {
    _id: string;
    userName: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    password: string;
    profilePicture: {
        key: string | null,
        url: string
    };
    about: string;
}

export interface IUserLoginCredentials {
    identifier: string | undefined;
    password: string | undefined;
}

export interface IUserRegisterationCredentials {
    userName: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

export interface IUserProfile extends Omit<IUser, "password"> { }