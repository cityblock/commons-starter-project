import { transaction } from 'objection';
import { IProgressNoteGlassBreakCreateInput, IRootMutationType, IRootQueryType } from 'schema';
import ProgressNoteGlassBreak from '../models/progress-note-glass-break';
import checkUserPermissions, { validateGlassBreakNotNeeded } from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IQuery {
  progressNoteId: string;
}

export interface IProgressNoteGlassBreakCreateArgs {
  input: IProgressNoteGlassBreakCreateInput;
}

export async function progressNoteGlassBreakCreate(
  root: any,
  { input }: IProgressNoteGlassBreakCreateArgs,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['progressNoteGlassBreakCreate']> {
  return transaction(testTransaction || ProgressNoteGlassBreak.knex(), async txn => {
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
  });
}

export async function resolveProgressNoteGlassBreaksForUser(
  root: any,
  input: {},
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['progressNoteGlassBreaksForUser']> {
  return transaction(testTransaction || ProgressNoteGlassBreak.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'progressNoteGlassBreak', txn);

    return ProgressNoteGlassBreak.getForCurrentUserSession(userId!, txn);
  });
}

export async function resolveProgressNoteGlassBreakCheck(
  root: any,
  { progressNoteId }: IQuery,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['progressNoteGlassBreakCheck']> {
  return transaction(testTransaction || ProgressNoteGlassBreak.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patientGlassBreak', txn);

    const isGlassBreakNotNeeded = await validateGlassBreakNotNeeded(
      userId!,
      'progressNote',
      progressNoteId,
      txn,
    );

    return {
      progressNoteId,
      isGlassBreakNotNeeded,
    };
  });
}
