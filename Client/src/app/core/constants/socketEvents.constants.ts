export const ChatEventEnum = Object.freeze({
    SOCKET_ERROR_EVENT: "connect_error",
    NEW_CHAT_EVENT: "newChat",
    LEAVE_CHAT_EVENT: "leaveChat",
    JOIN_CHAT_EVENT: "joinChat",
    MESSAGE_RECEIVED_EVENT: "messageReceived",
    MESSAGE_READ_EVENT: "messageRead",
    DELETE_LEAVED_GROUP_EVENT: "deleteLeavedGroup",
    USER_LEFT_THE_GROUP_EVENT: "userLeftTheGroup"
});