import {
  IProgressNoteTemplateCreateInput,
  IProgressNoteTemplateDeleteInput,
  IProgressNoteTemplateEditInput,
} from 'schema';
import ProgressNoteTemplate from '../models/progress-note-template';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

interface IProgressNoteTemplateCreateArgs {
  input: IProgressNoteTemplateCreateInput;
}

interface IResolveProgressNoteTemplateOptions {
  progressNoteTemplateId: string;
}

interface IEditProgressNoteTemplateOptions {
  input: IProgressNoteTemplateEditInput;
}

interface IDeleteProgressNoteTemplateOptions {
  input: IProgressNoteTemplateDeleteInput;
}

export async function progressNoteTemplateCreate(
  root: any,
  { input }: IProgressNoteTemplateCreateArgs,
  context: IContext,
) {
  const { userRole } = context;
  await accessControls.isAllowed(userRole, 'create', 'progressNoteTemplate');

  return await ProgressNoteTemplate.create(input);
}

export async function resolveProgressNoteTemplate(
  root: any,
  args: IResolveProgressNoteTemplateOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNoteTemplate');

  return await ProgressNoteTemplate.get(args.progressNoteTemplateId);
}

export async function resolveProgressNoteTemplates(
  root: any,
  args: any,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNoteTemplate');

  return await ProgressNoteTemplate.getAll();
}

export async function progressNoteTemplateEdit(
  root: any,
  args: IEditProgressNoteTemplateOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'progressNoteTemplate');

  return ProgressNoteTemplate.edit(args.input, args.input.progressNoteTemplateId);
}

export async function progressNoteTemplateDelete(
  root: any,
  args: IDeleteProgressNoteTemplateOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'progressNoteTemplate');

  return ProgressNoteTemplate.delete(args.input.progressNoteTemplateId);
}
