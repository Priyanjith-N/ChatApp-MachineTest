export interface IPayload {
    id: string
}

export default interface IJWTService {
    sign(payload: IPayload, expiresIn: string | number): string | never;
    verifyToken(token: string): IPayload | never;
}