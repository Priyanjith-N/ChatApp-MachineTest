export interface IChat {
    chatId: string;
    participants: string[]; // User IDs
    type: "one-to-one" | "group";
    groupName?: string;
    groupAdmin?: string;
    lastMessage: string;
    createdAt: Date;
}