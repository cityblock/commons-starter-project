import { IProgressNoteCompleteInput, IProgressNoteCreateInput } from 'schema';
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
}

interface ICompleteProgressNoteOptions {
  input: IProgressNoteCompleteInput;
}

export async function progressNoteCreate(
  root: any,
  { input }: IProgressNoteCreateArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'progressNote');
  checkUserLoggedIn(userId);

  return await ProgressNote.create({ ...input, userId: userId! });
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
