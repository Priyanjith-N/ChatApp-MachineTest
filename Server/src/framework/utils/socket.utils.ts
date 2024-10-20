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

const mountJoinAndLeaveChatEvent = (socket: IAuthSocket, activeChats: Map<string, Set<string>>) => {
    socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId: string) => {
      socket.join(chatId);

      if(activeChats.has(chatId)) {
        activeChats.get(chatId)?.add(socket.userId!);
      }else{
        activeChats.set(chatId, new Set<string>([socket.userId!]));
      }
    });

    socket.on(ChatEventEnum.LEAVE_CHAT_EVENT, (chatId: string) => {
        socket.leave(chatId);

        activeChats.get(chatId)?.delete(socket.userId!);
    });
};

export function connectSocket(httpServer: http.Server) {
    const activeChats: Map<string, Set<string>> = new Map();

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

        mountJoinAndLeaveChatEvent(socket, activeChats); // socket event listen for join
        
        socket.on(ChatEventEnum.DISCONNECT_EVENT, async () => {
            // disconneted
        });
    });


    return {
        emitSocketEvent: function<T>(roomId: string, event: string, payload: T) {
            io.in(roomId).emit(event, payload);
        },
        isReciverInChat(chatId: string, reciverId: string) {
            const usersJoined: Set<string> | undefined = activeChats.get(chatId);
            
            if(!usersJoined) return false;

            return usersJoined.has(reciverId);
        }
    }
}