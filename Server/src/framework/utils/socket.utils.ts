import http from "http";

import { isObjectIdOrHexString } from "mongoose";

import { Server, Socket } from "socket.io";

import { parse } from "cookie";

// constants
import { ChatEventEnum } from "../../constants/socketEvents.constants";

// interfaces
import JWTTokenError from "../../errors/jwtTokenError.error";
import IJWTService, { IPayload } from "../../interface/utils/IJWTService";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { ErrorMessage } from "../../enums/errorMesaage.enum";

// importing util services
import JWTService from "./jwtService.utils";

// importing classes

const jwtService: IJWTService = new JWTService();

interface IAuthSocket extends Socket {
    userId?: string;
}

export function connectSocket(httpServer: http.Server) {

    const io = new Server(httpServer, {
        pingTimeout: 60000,
        cors: {
            origin: process.env.CORS_ORIGIN ?? "",
            credentials: true
        }
    });
    
    io.use((socket: IAuthSocket, next) => {
        try {
            const rawCookies = socket.handshake.headers.cookie;
            
            if (!rawCookies) throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: ErrorMessage.NOT_AUTHENTICATED });

            const { token } = parse(rawCookies);

            if(!token) throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: ErrorMessage.NOT_AUTHENTICATED });

            try {
                const decoded: IPayload = jwtService.verifyToken(token);

                if(!isObjectIdOrHexString(decoded.id)) throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: ErrorMessage.NOT_AUTHENTICATED });

                socket.userId = decoded.id;
            } catch (err: any) {
                throw new JWTTokenError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.TOKEN_EXPIRED });
            }
            
            next();
        } catch (err: any) {
            next(err);
        } 
    });

    io.on(ChatEventEnum.CONNECTION, async (socket: IAuthSocket) => {
        socket.join(socket.userId!);
        
        socket.on(ChatEventEnum.DISCONNECT_EVENT, async () => {
            // disconneted
        });
    });


    return function emitSocketEvent<T>(roomId: string, event: string, payload: T) {
        io.in(roomId).emit(event, payload);
    }
}