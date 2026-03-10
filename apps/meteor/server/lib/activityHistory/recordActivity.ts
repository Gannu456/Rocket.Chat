import { callbacks } from '../callbacks';
import { ActivityHistory } from '@rocket.chat/models';

// Notice the `{ room }` destructuring in the second argument!
callbacks.add(
    'afterSaveMessage',
    async (message, { room }) => {
        // 1. Skip system messages (like "User joined the channel")
        // System messages usually have a 't' property. Standard user messages do not.
        if (message.t) {
            return message;
        }

        const activitiesToInsert = [];

        // 2. Track Direct Messages
        if (room.t === 'd') {
            // Check if uids exists on this specific room type to satisfy strict TypeScript
            const uids = 'uids' in room && Array.isArray(room.uids) ? room.uids : [];
            
            // Get the other user(s) in the DM, excluding the sender
            const otherUserIds = uids.filter((uid) => uid !== message.u._id);
            
            for (const targetUserId of otherUserIds) {
                activitiesToInsert.push({
                    userId: targetUserId,
                    roomName: `@${message.u.username}`, // Show who sent the DM
                    messageText: message.msg,
                    createdAt: new Date(),
                });
            }
        }

        // 3. Track Mentions in Channels/Groups
        if (message.mentions && message.mentions.length > 0) {
            for (const mention of message.mentions) {
                // Don't log if the user mentioned themselves
                if (mention._id !== message.u._id) {
                    activitiesToInsert.push({
                        userId: mention._id,
                        roomName: room.name || 'Unknown Channel',
                        messageText: message.msg,
                        createdAt: new Date(),
                    });
                }
            }
        }

        // 4. Batch insert all recorded activities into the database
        if (activitiesToInsert.length > 0) {
            await ActivityHistory.insertMany(activitiesToInsert);
        }

        return message;
    },
    callbacks.priority.LOW,
    'activity-hub-record-history'
);