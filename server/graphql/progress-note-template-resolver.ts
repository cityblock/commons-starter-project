import { transaction } from 'objection';
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
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['progressNoteTemplateCreate']> {
  return transaction(testTransaction || ProgressNoteTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'progressNoteTemplate', txn);

    return ProgressNoteTemplate.create(input, txn);
  });
}

export async function resolveProgressNoteTemplate(
  root: any,
  args: IResolveProgressNoteTemplateOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['progressNoteTemplate']> {
  return transaction(testTransaction || ProgressNoteTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'progressNoteTemplate', txn);

    return ProgressNoteTemplate.get(args.progressNoteTemplateId, txn);
  });
}

export async function resolveProgressNoteTemplates(
  root: any,
  args: any,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['progressNoteTemplates']> {
  return transaction(testTransaction || ProgressNoteTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'progressNoteTemplate', txn);

    return ProgressNoteTemplate.getAll(txn);
  });
}

export async function progressNoteTemplateEdit(
  root: any,
  args: IEditProgressNoteTemplateOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['progressNoteTemplateEdit']> {
  return transaction(testTransaction || ProgressNoteTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'progressNoteTemplate', txn);

    return ProgressNoteTemplate.edit(args.input, args.input.progressNoteTemplateId, txn);
  });
}

export async function progressNoteTemplateDelete(
  root: any,
  args: IDeleteProgressNoteTemplateOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['progressNoteTemplateDelete']> {
  return transaction(testTransaction || ProgressNoteTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'progressNoteTemplate', txn);

    return ProgressNoteTemplate.delete(args.input.progressNoteTemplateId, txn);
  });
}
