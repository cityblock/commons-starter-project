import { IProgressNoteGlassBreakCreateInput, IRootMutationType, IRootQueryType } from 'schema';
import ProgressNoteGlassBreak from '../models/progress-note-glass-break';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IProgressNoteGlassBreakCreateArgs {
  input: IProgressNoteGlassBreakCreateInput;
}

export async function progressNoteGlassBreakCreate(
  root: any,
  { input }: IProgressNoteGlassBreakCreateArgs,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['progressNoteGlassBreakCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'progressNoteGlassBreak', txn);

  return ProgressNoteGlassBreak.create(
    {
      userId: userId!,
      progressNoteId: input.progressNoteId,
      reason: input.reason,
      note: input.note || null,
    },
    txn,
  );
}

export async function resolveProgressNoteGlassBreaksForUser(
  root: any,
  input: {},
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['progressNoteGlassBreaksForUser']> {
  await checkUserPermissions(userId, permissions, 'view', 'progressNoteGlassBreak', txn);

  return ProgressNoteGlassBreak.getForCurrentUserSession(userId!, txn);
}
