import {
  IGoalSuggestionTemplateCreateInput,
  IGoalSuggestionTemplateDeleteInput,
  IGoalSuggestionTemplateEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import GoalSuggestionTemplate, {
  GoalSuggestionTemplateOrderOptions,
} from '../models/goal-suggestion-template';
import checkUserPermissions from './shared/permissions-check';
import { formatOrderOptions, IContext } from './shared/utils';

export interface IGoalSuggestionTemplatesCreateArgs {
  input: IGoalSuggestionTemplateCreateInput;
}

export interface IResolveGoalSuggestionTemplateOptions {
  answerId: string;
}

export interface IEditGoalSuggestionTemplateOptions {
  input: IGoalSuggestionTemplateEditInput;
}

export interface IDeleteGoalSuggestionTemplateOptions {
  input: IGoalSuggestionTemplateDeleteInput;
}

export async function goalSuggestionTemplateCreate(
  root: any,
  { input }: IGoalSuggestionTemplatesCreateArgs,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['goalSuggestionTemplateCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'goalSuggestionTemplate', txn);

  return GoalSuggestionTemplate.create(input, txn);
}

export async function resolveGoalSuggestionTemplates(
  root: any,
  args: any,
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['goalSuggestionTemplates']> {
  await checkUserPermissions(userId, permissions, 'view', 'goalSuggestionTemplate', txn);

  const { order, orderBy } = formatOrderOptions<GoalSuggestionTemplateOrderOptions>(args.orderBy, {
    orderBy: 'title',
    order: 'asc',
  });

  return GoalSuggestionTemplate.getAll({ orderBy, order }, txn);
}

export async function resolveGoalSuggestionTemplate(
  root: any,
  args: { goalSuggestionTemplateId: string },
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['goalSuggestionTemplate']> {
  await checkUserPermissions(userId, permissions, 'view', 'goalSuggestionTemplate', txn);

  return GoalSuggestionTemplate.get(args.goalSuggestionTemplateId, txn);
}

export async function goalSuggestionTemplateEdit(
  root: any,
  args: IEditGoalSuggestionTemplateOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['goalSuggestionTemplateEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'goalSuggestionTemplate', txn);

  return GoalSuggestionTemplate.edit(args.input.goalSuggestionTemplateId, args.input, txn);
}

export async function goalSuggestionTemplateDelete(
  root: any,
  args: IDeleteGoalSuggestionTemplateOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['goalSuggestionTemplateDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'goalSuggestionTemplate', txn);

  return GoalSuggestionTemplate.delete(args.input.goalSuggestionTemplateId, txn);
}
