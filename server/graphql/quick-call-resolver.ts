import { IQuickCallCreateInput, IRootMutationType, IRootQueryType } from 'schema';
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
): Promise<IRootMutationType['quickCallCreate']> {
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'quickCall');
  checkUserLoggedIn(userId);

  return QuickCall.create({ ...input, userId: userId! }, txn);
}

export async function resolveQuickCall(
  root: any,
  args: IResolveQuickCallArgs,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootQueryType['quickCall']> {
  await accessControls.isAllowed(userRole, 'view', 'quickCall');
  checkUserLoggedIn(userId);

  return QuickCall.get(args.quickCallId, txn);
}

export async function resolveQuickCallsForProgressNote(
  root: any,
  args: IResolveQuickCallsForProgressNoteOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootQueryType['quickCallsForProgressNote']> {
  await accessControls.isAllowed(userRole, 'view', 'quickCall');
  checkUserLoggedIn(userId);

  return QuickCall.getQuickCallsForProgressNote(args.progressNoteId, txn);
}
