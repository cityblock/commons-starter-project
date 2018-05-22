import { transaction } from 'objection';
import {
  ICBOReferralCreateInput,
  ICBOReferralEditInput,
  IRootMutationType,
  TaskEventTypes,
} from 'schema';
import { addJobToQueue } from '../helpers/queue-helpers';
import CBOReferral from '../models/cbo-referral';
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
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['CBOReferralCreate']> {
  return transaction(testTransaction || CBOReferral.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'CBOReferral', txn);

    return CBOReferral.create(input, txn);
  });
}

export async function CBOReferralEdit(
  root: any,
  { input }: IEditCBOReferralOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['CBOReferralEdit']> {
  return transaction(testTransaction || CBOReferral.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'task', txn, input.taskId);

    const referral = await CBOReferral.edit(input as any, input.CBOReferralId, txn);

    if (input.sentAt) {
      addJobToQueue('taskEvent', {
        taskId: input.taskId,
        userId: userId!,
        eventType: 'cbo_referral_edit_sent_at' as TaskEventTypes,
      });
    }

    if (input.acknowledgedAt) {
      addJobToQueue('taskEvent', {
        taskId: input.taskId,
        userId: userId!,
        eventType: 'cbo_referral_edit_acknowledged_at' as TaskEventTypes,
      });
    }

    return referral;
  });
}
