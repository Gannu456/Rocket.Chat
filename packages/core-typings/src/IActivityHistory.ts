import type { IRocketChatRecord } from './IRocketChatRecord';

export interface IActivityHistory extends IRocketChatRecord {
    userId: string;
    roomName?: string;
    messageText: string;
    createdAt: Date;
}