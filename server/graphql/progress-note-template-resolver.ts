import {
  IProgressNoteTemplateCreateInput,
  IProgressNoteTemplateDeleteInput,
  IProgressNoteTemplateEditInput,
  IRootMutationType,
  IRootQueryType,
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
): Promise<IRootMutationType['progressNoteTemplateCreate']> {
  const { userRole, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'progressNoteTemplate');

  return ProgressNoteTemplate.create(input, txn);
}

export async function resolveProgressNoteTemplate(
  root: any,
  args: IResolveProgressNoteTemplateOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['progressNoteTemplate']> {
  await accessControls.isAllowed(userRole, 'view', 'progressNoteTemplate');

  return ProgressNoteTemplate.get(args.progressNoteTemplateId, txn);
}

export async function resolveProgressNoteTemplates(
  root: any,
  args: any,
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['progressNoteTemplates']> {
  await accessControls.isAllowed(userRole, 'view', 'progressNoteTemplate');

  return ProgressNoteTemplate.getAll(txn);
}

export async function progressNoteTemplateEdit(
  root: any,
  args: IEditProgressNoteTemplateOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['progressNoteTemplateEdit']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'progressNoteTemplate');

  return ProgressNoteTemplate.edit(args.input, args.input.progressNoteTemplateId, txn);
}

export async function progressNoteTemplateDelete(
  root: any,
  args: IDeleteProgressNoteTemplateOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootMutationType['progressNoteTemplateDelete']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'progressNoteTemplate');

  return ProgressNoteTemplate.delete(args.input.progressNoteTemplateId, txn);
}
