import {
  ICBOReferralCreateInput,
  ICBOReferralEditInput,
  IRootMutationType,
  TaskEventTypes,
} from 'schema';
import CBOReferral from '../models/cbo-referral';
import TaskEvent from '../models/task-event';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface ICBOReferralCreateArgs {
  input: ICBOReferralCreateInput;
}

export interface IEditCBOReferralOptions {
  input: ICBOReferralEditInput;
}

export async function CBOReferralCreate(
  root: any,
  { input }: ICBOReferralCreateArgs,
  { db, permissions, userId, txn }: IContext,
): Promise<IRootMutationType['CBOReferralCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'CBOReferral', txn);

  return CBOReferral.create(input, txn);
}

export async function CBOReferralEdit(
  root: any,
  { input }: IEditCBOReferralOptions,
  { db, permissions, userId, txn }: IContext,
): Promise<IRootMutationType['CBOReferralEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'task', txn, input.taskId);

  const referral = await CBOReferral.edit(input as any, input.CBOReferralId, txn);

  if (input.sentAt) {
    await TaskEvent.create(
      {
        taskId: input.taskId,
        userId: userId!,
        eventType: 'cbo_referral_edit_sent_at' as TaskEventTypes,
      },
      txn,
    );
  }

  if (input.acknowledgedAt) {
    await TaskEvent.create(
      {
        taskId: input.taskId,
        userId: userId!,
        eventType: 'cbo_referral_edit_acknowledged_at' as TaskEventTypes,
      },
      txn,
    );
  }

  return referral;
}
