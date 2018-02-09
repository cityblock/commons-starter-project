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
import accessControls from './shared/access-controls';
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
  context: IContext,
): Promise<IRootMutationType['goalSuggestionTemplateCreate']> {
  const { userRole, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'goalSuggestionTemplate');

  return GoalSuggestionTemplate.create(input, txn);
}

export async function resolveGoalSuggestionTemplates(
  root: any,
  args: any,
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['goalSuggestionTemplates']> {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestionTemplate');

  const { order, orderBy } = formatOrderOptions<GoalSuggestionTemplateOrderOptions>(args.orderBy, {
    orderBy: 'createdAt',
    order: 'desc',
  });

  return GoalSuggestionTemplate.getAll({ orderBy, order }, txn);
}

export async function resolveGoalSuggestionTemplate(
  root: any,
  args: { goalSuggestionTemplateId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['goalSuggestionTemplate']> {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestionTemplate');

  return GoalSuggestionTemplate.get(args.goalSuggestionTemplateId, txn);
}

export async function goalSuggestionTemplateEdit(
  root: any,
  args: IEditGoalSuggestionTemplateOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootMutationType['goalSuggestionTemplateEdit']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'goalSuggestionTemplate');

  return GoalSuggestionTemplate.edit(args.input.goalSuggestionTemplateId, args.input, txn);
}

export async function goalSuggestionTemplateDelete(
  root: any,
  args: IDeleteGoalSuggestionTemplateOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootMutationType['goalSuggestionTemplateDelete']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'goalSuggestionTemplate');

  return GoalSuggestionTemplate.delete(args.input.goalSuggestionTemplateId, txn);
}
