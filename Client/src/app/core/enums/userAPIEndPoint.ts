export enum UserAPIEndPoint {
    GET_USER_PROFILE = "/api/user",
    LOGOUT = "/api/logout",
    GET_ALL_USERS = "/api/allusers",
    CREATE_NEW_CHAT = "/api/createnewchat",
    GET_ALL_CHATS = "/api/chats",
    GET_MESSAGES_OF_CHAT = "/api/messages/",
    SEND_MESSAGE = "/api/sendmessage/",
    CREATE_NEW_GROUP = "/api/createnewgroupchat",
    LEAVE_GROUP_CHAT = "/api/leavegroupchat/",
    GET_ALL_USERS_NOT_PRESENT_IN_CURRENT_GROUP = "/api/allusersnotincurrentgroup/",
    ADD_MEMBERS_IN_GROUP = "/api/addnewmembersingroup/"
}