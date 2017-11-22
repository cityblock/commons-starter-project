import { transaction } from 'objection';
import { IQuickCallCreateInput } from 'schema';
import QuickCall from '../models/quick-call';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

interface IQuickCallCreateOptions {
  input: IQuickCallCreateInput;
}

interface IResolveQuickCallArgs {
  quickCallId: string;
}

interface IResolveQuickCallsForProgressNoteOptions {
  progressNoteId: string;
}

export async function quickCallCreate(
  root: any,
  { input }: IQuickCallCreateOptions,
  context: IContext,
) {
  const { userRole, userId, txn } = context;
  return transaction(txn || QuickCall.knex(), async newTxn => {
    await accessControls.isAllowed(userRole, 'create', 'quickCall');
    checkUserLoggedIn(userId);

    return await QuickCall.create({ ...input, userId: userId! }, newTxn);
  });
}

export async function resolveQuickCall(
  root: any,
  args: IResolveQuickCallArgs,
  { db, userId, userRole, txn }: IContext,
) {
  return transaction(txn || QuickCall.knex(), async newTxn => {
    await accessControls.isAllowed(userRole, 'view', 'quickCall');
    checkUserLoggedIn(userId);

    return await QuickCall.get(args.quickCallId, newTxn);
  });
}

export async function resolveQuickCallsForProgressNote(
  root: any,
  args: IResolveQuickCallsForProgressNoteOptions,
  { db, userId, userRole, txn }: IContext,
) {
  return transaction(txn || QuickCall.knex(), async newTxn => {
    await accessControls.isAllowed(userRole, 'view', 'quickCall');
    checkUserLoggedIn(userId);

    return await QuickCall.getQuickCallsForProgressNote(args.progressNoteId, newTxn);
  });
}
