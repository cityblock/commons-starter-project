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
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['taskTemplateCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'taskTemplate', txn);

  return TaskTemplate.create(input as any, txn);
}

export async function resolveTaskTemplate(
  root: any,
  args: { taskTemplateId: string },
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['taskTemplate']> {
  await checkUserPermissions(userId, permissions, 'view', 'taskTemplate', txn);

  return TaskTemplate.get(args.taskTemplateId, txn);
}

export async function resolveTaskTemplates(
  root: any,
  args: any,
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['taskTemplates']> {
  await checkUserPermissions(userId, permissions, 'view', 'taskTemplate', txn);

  return TaskTemplate.getAll(txn);
}

export async function taskTemplateEdit(
  root: any,
  args: IEditTaskTemplateOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['taskTemplateEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'taskTemplate', txn);

  // TODO: fix typings here
  return TaskTemplate.edit(args.input.taskTemplateId, args.input as any, txn);
}

export async function taskTemplateDelete(
  root: any,
  args: IDeleteTaskTemplateOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['taskTemplateDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'taskTemplate', txn);

  return TaskTemplate.delete(args.input.taskTemplateId, txn);
}
