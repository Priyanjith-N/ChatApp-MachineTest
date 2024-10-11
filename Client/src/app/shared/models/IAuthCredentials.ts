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