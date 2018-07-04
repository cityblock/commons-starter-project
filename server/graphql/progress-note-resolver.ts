import { withFilter } from 'graphql-subscriptions';
import { transaction } from 'objection';
import {
  IProgressNoteAddSupervisorNotesInput,
  IProgressNoteCompleteInput,
  IProgressNoteCompleteSupervisorReviewInput,
  IProgressNoteCreateInput,
  IProgressNoteEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import ComputedPatientStatus from '../models/computed-patient-status';
import ProgressNote from '../models/progress-note';
import PubSub from '../subscriptions';
import checkUserPermissions, { validateGlassBreak } from './shared/permissions-check';
import { IContext } from './shared/utils';

interface IProgressNoteCreateArgs {
  input: IProgressNoteCreateInput;
}

interface IResolveProgressNoteOptions {
  progressNoteId: string;
  glassBreakId: string | null;
}

interface IResolveProgressNotesForPatientOptions {
  patientId: string;
  completed: boolean;
  glassBreakId: string | null;
}

interface IResolveProgressNotesForCurrentUserOptions {
  completed: boolean;
}

interface IResolveProgressNoteLatestForPatientOptions {
  patientId: string;
}

interface ICompleteProgressNoteOptions {
  input: IProgressNoteCompleteInput;
}

interface IEditProgressNoteOptions {
  input: IProgressNoteEditInput;
}

interface IAddSupervisorNotesOptions {
  input: IProgressNoteAddSupervisorNotesInput;
}

interface IProgressNoteCompleteSupervisorReviewOptions {
  input: IProgressNoteCompleteSupervisorReviewInput;
}

export async function progressNoteCreate(
  root: any,
  { input }: IProgressNoteCreateArgs,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['progressNoteCreate']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

    return ProgressNote.autoOpenIfRequired({ ...input, userId: userId! }, txn);
  });
}

export async function progressNoteComplete(
  root: any,
  { input }: ICompleteProgressNoteOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['progressNoteComplete']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'progressNote',
      txn,
      input.progressNoteId,
    );

    const progressNote = await ProgressNote.complete(input.progressNoteId, txn);

    await ComputedPatientStatus.updateForPatient(progressNote.patientId, userId!, txn);

    return progressNote;
  });
}

export async function progressNoteEdit(
  root: any,
  { input }: IEditProgressNoteOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['progressNoteEdit']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'progressNote',
      txn,
      input.progressNoteId,
    );

    return ProgressNote.update(
      input.progressNoteId,
      {
        progressNoteTemplateId: input.progressNoteTemplateId || undefined,
        startedAt: input.startedAt || undefined,
        location: input.location || undefined,
        summary: input.summary || undefined,
        memberConcern: input.memberConcern || undefined,
        supervisorId: input.supervisorId || undefined,
        needsSupervisorReview:
          input.needsSupervisorReview === null ? undefined : input.needsSupervisorReview,
        worryScore: input.worryScore || undefined,
      },
      txn,
    );
  });
}

export async function progressNoteAddSupervisorNotes(
  root: any,
  { input }: IAddSupervisorNotesOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['progressNoteAddSupervisorNotes']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'progressNote',
      txn,
      input.progressNoteId,
    );

    const progressNote = await ProgressNote.get(input.progressNoteId, txn);
    if (!progressNote) {
      throw new Error('progress note not found');
    }
    if (progressNote.supervisorId !== userId) {
      throw new Error('you are not the supervisor permitted to review this progress note');
    }

    return ProgressNote.addSupervisorNotes(input.progressNoteId, input.supervisorNotes, txn);
  });
}

export async function progressNoteCompleteSupervisorReview(
  root: any,
  { input }: IProgressNoteCompleteSupervisorReviewOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['progressNoteCompleteSupervisorReview']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'progressNote',
      txn,
      input.progressNoteId,
    );

    const progressNote = await ProgressNote.get(input.progressNoteId, txn);
    if (!progressNote) {
      throw new Error('progress note not found');
    }
    if (progressNote.supervisorId !== userId) {
      throw new Error('you are not the supervisor permitted to review this progress note');
    }

    return ProgressNote.completeSupervisorReview(input.progressNoteId, txn);
  });
}

export async function resolveProgressNote(
  root: any,
  args: IResolveProgressNoteOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['progressNote']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'view',
      'progressNote',
      txn,
      args.progressNoteId,
    );
    await validateGlassBreak(
      userId!,
      permissions,
      'progressNote',
      args.progressNoteId,
      txn,
      args.glassBreakId,
    );

    return ProgressNote.get(args.progressNoteId, txn);
  });
}

export async function resolveProgressNoteIdsForPatient(
  root: any,
  args: IResolveProgressNotesForPatientOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['progressNoteIdsForPatient']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
    await validateGlassBreak(
      userId!,
      permissions,
      'patient',
      args.patientId,
      txn,
      args.glassBreakId,
    );

    return ProgressNote.getAllIdsForPatient(args.patientId, args.completed, txn);
  });
}

export async function resolveProgressNotesForCurrentUser(
  root: any,
  args: IResolveProgressNotesForCurrentUserOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['progressNotesForCurrentUser']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);

    return ProgressNote.getAllForUser(userId!, args.completed, txn);
  });
}

export async function resolveProgressNotesForSupervisorReview(
  root: any,
  args: any,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['progressNotesForSupervisorReview']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);

    return ProgressNote.getProgressNotesForSupervisorReview(userId!, txn);
  });
}

export async function resolveProgressNoteLatestForPatient(
  root: any,
  { patientId }: IResolveProgressNoteLatestForPatientOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['progressNoteLatestForPatient']> {
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

    return ProgressNote.getLatestForPatient(patientId, txn);
  });
}

export async function progressNoteCreateSubscribe(root: any, query: {}, context: IContext) {
  const { permissions, userId, testTransaction } = context;
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);

    const pubsub = PubSub.get();
    // only listen to messages for given user
    return withFilter(
      () => pubsub.asyncIterator('progressNoteCreated'),
      payload => {
        return payload.userId === userId;
      },
    )(root, query, context);
  });
}
