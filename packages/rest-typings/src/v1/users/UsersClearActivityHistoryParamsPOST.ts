import { ajv } from '../Ajv';

export type UsersClearActivityHistoryParamsPOST = Record<string, never>;
const UsersClearActivityHistoryParamsPostSchema = {
    type: 'object',
    additionalProperties: false,
};
export const isUsersClearActivityHistoryParamsPOST = ajv.compile<UsersClearActivityHistoryParamsPOST>(UsersClearActivityHistoryParamsPostSchema);