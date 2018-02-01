import { ITaskTemplateCreateInput, ITaskTemplateDeleteInput, ITaskTemplateEditInput } from 'schema';
import TaskTemplate from '../models/task-template';
import accessControls from './shared/access-controls';
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
  { userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'create', 'taskTemplate');

  return TaskTemplate.create(input as any, txn);
}

export async function resolveTaskTemplate(
  root: any,
  args: { taskTemplateId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'taskTemplate');

  return TaskTemplate.get(args.taskTemplateId, txn);
}

export async function resolveTaskTemplates(root: any, args: any, { db, userRole, txn }: IContext) {
  await accessControls.isAllowed(userRole, 'view', 'taskTemplate');

  return TaskTemplate.getAll(txn);
}

export async function taskTemplateEdit(
  root: any,
  args: IEditTaskTemplateOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'taskTemplate');

  // TODO: fix typings here
  return TaskTemplate.edit(args.input.taskTemplateId, args.input as any, txn);
}

export async function taskTemplateDelete(
  root: any,
  args: IDeleteTaskTemplateOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'taskTemplate');
  return TaskTemplate.delete(args.input.taskTemplateId, txn);
}
