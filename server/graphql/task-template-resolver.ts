import { transaction } from 'objection';
import {
  IRootMutationType,
  IRootQueryType,
  ITaskTemplateCreateInput,
  ITaskTemplateDeleteInput,
  ITaskTemplateEditInput,
} from 'schema';
import TaskTemplate from '../models/task-template';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface ITaskTemplateCreateArgs {
  input: ITaskTemplateCreateInput;
}

export interface IResolveTaskTemplateOptions {
  taskTemplateId: string;
}

export interface IEditTaskTemplateOptions {
  input: ITaskTemplateEditInput;
}

export interface IDeleteTaskTemplateOptions {
  input: ITaskTemplateDeleteInput;
}

export async function taskTemplateCreate(
  root: any,
  { input }: ITaskTemplateCreateArgs,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['taskTemplateCreate']> {
  return transaction(testTransaction || TaskTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'taskTemplate', txn);

    return TaskTemplate.create(input as any, txn);
  });
}

export async function resolveTaskTemplate(
  root: any,
  args: { taskTemplateId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['taskTemplate']> {
  return transaction(testTransaction || TaskTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'taskTemplate', txn);

    return TaskTemplate.get(args.taskTemplateId, txn);
  });
}

export async function resolveTaskTemplates(
  root: any,
  args: any,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['taskTemplates']> {
  return transaction(testTransaction || TaskTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'taskTemplate', txn);

    return TaskTemplate.getAll(txn);
  });
}

export async function taskTemplateEdit(
  root: any,
  args: IEditTaskTemplateOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['taskTemplateEdit']> {
  return transaction(testTransaction || TaskTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'taskTemplate', txn);

    // TODO: fix typings here
    return TaskTemplate.edit(args.input.taskTemplateId, args.input as any, txn);
  });
}

export async function taskTemplateDelete(
  root: any,
  args: IDeleteTaskTemplateOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['taskTemplateDelete']> {
  return transaction(testTransaction || TaskTemplate.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'taskTemplate', txn);

    return TaskTemplate.delete(args.input.taskTemplateId, txn);
  });
}
