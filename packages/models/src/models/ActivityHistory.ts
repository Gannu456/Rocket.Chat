import type { IActivityHistory, RocketChatRecordDeleted } from '@rocket.chat/core-typings';
import type { Collection, Db, DeleteResult, FindOptions, IndexDescription, FindCursor, WithId } from 'mongodb';

import type { IActivityHistoryModel } from '@rocket.chat/model-typings';
import type { FindPaginated } from '@rocket.chat/model-typings/src/models/IBaseModel';
import { BaseRaw } from './BaseRaw';

export class ActivityHistoryRaw extends BaseRaw<IActivityHistory> implements IActivityHistoryModel {
    constructor(db: Db, trash?: Collection<RocketChatRecordDeleted<IActivityHistory>>) {
        super(db, 'activity_history', trash);
    }

    protected override modelIndexes(): IndexDescription[] {
        return [
            { key: { userId: 1, createdAt: -1 } },
        ];
    }

    findPaginatedByUserId(
        userId: string, 
        options?: FindOptions<IActivityHistory>
    ): FindPaginated<FindCursor<WithId<IActivityHistory>>> {
        return this.findPaginated({ userId }, options);
    }

    removeByIdAndUserId(_id: string, userId: string): Promise<DeleteResult> {
        return this.deleteOne({ _id, userId });
    }

    removeByUserId(userId: string): Promise<DeleteResult> {
        return this.deleteMany({ userId });
    }
}