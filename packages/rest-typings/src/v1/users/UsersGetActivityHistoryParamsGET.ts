import type { PaginatedRequest } from '../../helpers/PaginatedRequest';
import { ajv } from '../Ajv';

export type UsersGetActivityHistoryParamsGET = PaginatedRequest<{}>;
const UsersGetActivityHistoryParamsGetSchema = {
    type: 'object',
    properties: {
        count: { type: 'number', nullable: true },
        offset: { type: 'number', nullable: true },
        sort: { type: 'string', nullable: true },
        query: { type: 'string', nullable: true },
    },
    additionalProperties: false,
};
export const isUsersGetActivityHistoryParamsGET = ajv.compile<UsersGetActivityHistoryParamsGET>(UsersGetActivityHistoryParamsGetSchema);