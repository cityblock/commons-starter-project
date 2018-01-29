import { ICBOReferralCreateInput, ICBOReferralEditInput } from 'schema';
import CBOReferral from '../models/cbo-referral';
import TaskEvent from '../models/task-event';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface ICBOReferralCreateArgs {
  input: ICBOReferralCreateInput;
}

export interface IEditCBOReferralOptions {
  input: ICBOReferralEditInput;
}

export async function CBOReferralCreate(
  root: any,
  { input }: ICBOReferralCreateArgs,
  { db, userRole, userId, txn }: IContext,
): Promise<CBOReferral> {
  await accessControls.isAllowedForUser(userRole, 'create', 'CBOReferral');
  checkUserLoggedIn(userId);

  return await CBOReferral.create(input, txn);
}

export async function CBOReferralEdit(
  root: any,
  { input }: IEditCBOReferralOptions,
  { db, userRole, userId, txn }: IContext,
): Promise<CBOReferral> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'CBOReferral');
  checkUserLoggedIn(userId);

  const referral = await CBOReferral.edit(input, input.CBOReferralId, txn);

  if (input.sentAt) {
    await TaskEvent.create(
      {
        taskId: input.taskId,
        userId: userId!,
        eventType: 'cbo_referral_edit_sent_at',
      },
      txn,
    );
  }

  if (input.acknowledgedAt) {
    await TaskEvent.create(
      {
        taskId: input.taskId,
        userId: userId!,
        eventType: 'cbo_referral_edit_acknowledged_at',
      },
      txn,
    );
  }

  return referral;
}
