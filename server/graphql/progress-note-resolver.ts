import {
  IProgressNoteCompleteInput,
  IProgressNoteEditInput,
  IProgressNoteGetOrCreateInput,
} from 'schema';
import ProgressNote from '../models/progress-note';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

interface IProgressNoteGetOrCreateArgs {
  input: IProgressNoteGetOrCreateInput;
}

interface IResolveProgressNoteOptions {
  progressNoteId: string;
}

interface IResolveProgressNotesForPatientOptions {
  patientId: string;
}

interface ICompleteProgressNoteOptions {
  input: IProgressNoteCompleteInput;
}

interface IEditProgressNoteOptions {
  input: IProgressNoteEditInput;
}

export async function progressNoteGetOrCreate(
  root: any,
  { input }: IProgressNoteGetOrCreateArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'progressNote');
  checkUserLoggedIn(userId);

  return await ProgressNote.autoOpenIfRequired({ ...input, userId: userId! });
}

export async function progressNoteComplete(
  root: any,
  { input }: ICompleteProgressNoteOptions,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'edit', 'progressNote');
  checkUserLoggedIn(userId);

  return await ProgressNote.complete(input.progressNoteId);
}

export async function progressNoteEdit(
  root: any,
  { input }: IEditProgressNoteOptions,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'edit', 'progressNote');
  checkUserLoggedIn(userId);

  return await ProgressNote.update(input.progressNoteId, {
    progressNoteTemplateId: input.progressNoteTemplateId,
  });
}

export async function resolveProgressNote(
  root: any,
  args: IResolveProgressNoteOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNote');

  return await ProgressNote.get(args.progressNoteId);
}

export async function resolveProgressNotesForPatient(
  root: any,
  args: IResolveProgressNotesForPatientOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNote');

  return await ProgressNote.getAllForPatient(args.patientId);
}
