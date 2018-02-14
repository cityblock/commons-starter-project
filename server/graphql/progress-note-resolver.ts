import {
  IProgressNoteAddSupervisorNotesInput,
  IProgressNoteCompleteInput,
  IProgressNoteCompleteSupervisorReviewInput,
  IProgressNoteCreateInput,
  IProgressNoteEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import ProgressNote from '../models/progress-note';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

interface IProgressNoteCreateArgs {
  input: IProgressNoteCreateInput;
}

interface IResolveProgressNoteOptions {
  progressNoteId: string;
}

interface IResolveProgressNotesForPatientOptions {
  patientId: string;
  completed: boolean;
}

interface IResolveProgressNotesForCurrentUserOptions {
  completed: boolean;
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
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['progressNoteCreate']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  return ProgressNote.autoOpenIfRequired({ ...input, userId: userId! }, txn);
}

export async function progressNoteComplete(
  root: any,
  { input }: ICompleteProgressNoteOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['progressNoteComplete']> {
  await checkUserPermissions(
    userId,
    permissions,
    'edit',
    'progressNote',
    txn,
    input.progressNoteId,
  );

  return ProgressNote.complete(input.progressNoteId, txn);
}

export async function progressNoteEdit(
  root: any,
  { input }: IEditProgressNoteOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['progressNoteEdit']> {
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
    },
    txn,
  );
}

export async function progressNoteAddSupervisorNotes(
  root: any,
  { input }: IAddSupervisorNotesOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['progressNoteAddSupervisorNotes']> {
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
}

export async function progressNoteCompleteSupervisorReview(
  root: any,
  { input }: IProgressNoteCompleteSupervisorReviewOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['progressNoteCompleteSupervisorReview']> {
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
}

export async function resolveProgressNote(
  root: any,
  args: IResolveProgressNoteOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['progressNote']> {
  await checkUserPermissions(userId, permissions, 'view', 'progressNote', txn, args.progressNoteId);

  return ProgressNote.get(args.progressNoteId, txn);
}

export async function resolveProgressNotesForPatient(
  root: any,
  args: IResolveProgressNotesForPatientOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['progressNotesForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return ProgressNote.getAllForPatient(args.patientId, args.completed, txn);
}

export async function resolveProgressNotesForCurrentUser(
  root: any,
  args: IResolveProgressNotesForCurrentUserOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['progressNotesForCurrentUser']> {
  await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);

  return ProgressNote.getAllForUser(userId!, args.completed, txn);
}

export async function resolveProgressNotesForSupervisorReview(
  root: any,
  args: any,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['progressNotesForSupervisorReview']> {
  await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);

  return ProgressNote.getProgressNotesForSupervisorReview(userId!, txn);
}
