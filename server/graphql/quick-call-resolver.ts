import { IQuickCallCreateInput, IRootMutationType, IRootQueryType } from 'schema';
import QuickCall from '../models/quick-call';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['quickCallCreate']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  return QuickCall.create({ ...input, userId: userId! }, txn);
}

export async function resolveQuickCall(
  root: any,
  args: IResolveQuickCallArgs,
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['quickCall']> {
  await checkUserPermissions(userId, permissions, 'view', 'quickCall', txn, args.quickCallId);

  return QuickCall.get(args.quickCallId, txn);
}

export async function resolveQuickCallsForProgressNote(
  root: any,
  args: IResolveQuickCallsForProgressNoteOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['quickCallsForProgressNote']> {
  await checkUserPermissions(userId, permissions, 'view', 'progressNote', txn, args.progressNoteId);

  return QuickCall.getQuickCallsForProgressNote(args.progressNoteId, txn);
}
