import { ajv } from '../Ajv';

export type UsersRemoveActivityHistoryItemParamsPOST = { itemId: string };
const UsersRemoveActivityHistoryItemParamsPostSchema = {
    type: 'object',
    properties: {
        itemId: { type: 'string' },
    },
    required: ['itemId'],
    additionalProperties: false,
};
export const isUsersRemoveActivityHistoryItemParamsPOST = ajv.compile<UsersRemoveActivityHistoryItemParamsPOST>(UsersRemoveActivityHistoryItemParamsPostSchema);