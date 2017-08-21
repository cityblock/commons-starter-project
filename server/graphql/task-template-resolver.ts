import { pickBy } from 'lodash';
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
  root: any, { input }: ITaskTemplateCreateArgs, { userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'create', 'taskTemplate');

  return await TaskTemplate.create(input as any);
}

export async function resolveTaskTemplate(
  root: any, args: { taskTemplateId: string }, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'taskTemplate');

  return await TaskTemplate.get(args.taskTemplateId);
}

export async function resolveTaskTemplates(
  root: any, args: any, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'taskTemplate');

  return await TaskTemplate.getAll();
}

export async function taskTemplateEdit(
  root: any, args: IEditTaskTemplateOptions, { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'taskTemplate');

  // TODO: fix typings here
  const cleanedParams = pickBy<ITaskTemplateEditInput, {}>(args.input) as any;
  return TaskTemplate.edit(args.input.taskTemplateId, cleanedParams);
}

export async function taskTemplateDelete(
  root: any, args: IDeleteTaskTemplateOptions, { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'taskTemplate');
  return TaskTemplate.delete(args.input.taskTemplateId);
}
