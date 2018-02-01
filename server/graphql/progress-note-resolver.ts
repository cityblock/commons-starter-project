import {
  IProgressNoteAddSupervisorNotesInput,
  IProgressNoteCompleteInput,
  IProgressNoteCompleteSupervisorReviewInput,
  IProgressNoteCreateInput,
  IProgressNoteEditInput,
} from 'schema';
import ProgressNote from '../models/progress-note';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

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
  { userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'create', 'progressNote');
  checkUserLoggedIn(userId);

  return ProgressNote.autoOpenIfRequired({ ...input, userId: userId! }, txn);
}

export async function progressNoteComplete(
  root: any,
  { input }: ICompleteProgressNoteOptions,
  { userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'edit', 'progressNote');
  checkUserLoggedIn(userId);

  return ProgressNote.complete(input.progressNoteId, txn);
}

export async function progressNoteEdit(
  root: any,
  { input }: IEditProgressNoteOptions,
  { userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'edit', 'progressNote');
  checkUserLoggedIn(userId);

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
  { userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'edit', 'progressNote');
  checkUserLoggedIn(userId);

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
  { userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'edit', 'progressNote');
  checkUserLoggedIn(userId);

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
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNote');

  return ProgressNote.get(args.progressNoteId, txn);
}

export async function resolveProgressNotesForPatient(
  root: any,
  args: IResolveProgressNotesForPatientOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNote');

  return ProgressNote.getAllForPatient(args.patientId, args.completed, txn);
}

export async function resolveProgressNotesForCurrentUser(
  root: any,
  args: IResolveProgressNotesForCurrentUserOptions,
  { db, userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNote');
  checkUserLoggedIn(userId);

  return ProgressNote.getAllForUser(userId!, args.completed, txn);
}

export async function resolveProgressNotesForSupervisorReview(
  root: any,
  args: any,
  { db, userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNote');
  checkUserLoggedIn(userId);

  return ProgressNote.getProgressNotesForSupervisorReview(userId!, txn);
}
