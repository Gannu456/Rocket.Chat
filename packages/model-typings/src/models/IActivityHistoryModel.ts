import type { IActivityHistory } from '@rocket.chat/core-typings';
import type { DeleteResult, FindOptions, FindCursor, WithId } from 'mongodb';

import type { IBaseModel, FindPaginated } from './IBaseModel';

export interface IActivityHistoryModel extends IBaseModel<IActivityHistory> {
    findPaginatedByUserId(
        userId: string, 
        options?: FindOptions<IActivityHistory>
    ): FindPaginated<FindCursor<WithId<IActivityHistory>>>;

    removeByIdAndUserId(_id: string, userId: string): Promise<DeleteResult>;

    removeByUserId(userId: string): Promise<DeleteResult>;
}