import {
  IProgressNoteTemplateCreateInput,
  IProgressNoteTemplateDeleteInput,
  IProgressNoteTemplateEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import ProgressNoteTemplate from '../models/progress-note-template';
import checkUserPermissions from './shared/permissions-check';
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
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['progressNoteTemplateCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'progressNoteTemplate', txn);

  return ProgressNoteTemplate.create(input, txn);
}

export async function resolveProgressNoteTemplate(
  root: any,
  args: IResolveProgressNoteTemplateOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['progressNoteTemplate']> {
  await checkUserPermissions(userId, permissions, 'view', 'progressNoteTemplate', txn);

  return ProgressNoteTemplate.get(args.progressNoteTemplateId, txn);
}

export async function resolveProgressNoteTemplates(
  root: any,
  args: any,
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['progressNoteTemplates']> {
  await checkUserPermissions(userId, permissions, 'view', 'progressNoteTemplate', txn);

  return ProgressNoteTemplate.getAll(txn);
}

export async function progressNoteTemplateEdit(
  root: any,
  args: IEditProgressNoteTemplateOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['progressNoteTemplateEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'progressNoteTemplate', txn);

  return ProgressNoteTemplate.edit(args.input, args.input.progressNoteTemplateId, txn);
}

export async function progressNoteTemplateDelete(
  root: any,
  args: IDeleteProgressNoteTemplateOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['progressNoteTemplateDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'progressNoteTemplate', txn);

  return ProgressNoteTemplate.delete(args.input.progressNoteTemplateId, txn);
}
