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
  const { userRole, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'progressNoteTemplate');

  return await ProgressNoteTemplate.create(input, txn);
}

export async function resolveProgressNoteTemplate(
  root: any,
  args: IResolveProgressNoteTemplateOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNoteTemplate');

  return await ProgressNoteTemplate.get(args.progressNoteTemplateId, txn);
}

export async function resolveProgressNoteTemplates(
  root: any,
  args: any,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'progressNoteTemplate');

  return await ProgressNoteTemplate.getAll(txn);
}

export async function progressNoteTemplateEdit(
  root: any,
  args: IEditProgressNoteTemplateOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'progressNoteTemplate');

  return ProgressNoteTemplate.edit(args.input, args.input.progressNoteTemplateId, txn);
}

export async function progressNoteTemplateDelete(
  root: any,
  args: IDeleteProgressNoteTemplateOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'progressNoteTemplate');

  return ProgressNoteTemplate.delete(args.input.progressNoteTemplateId, txn);
}
