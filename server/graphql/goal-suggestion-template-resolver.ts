import {
  IGoalSuggestionTemplateCreateInput,
  IGoalSuggestionTemplateDeleteInput,
  IGoalSuggestionTemplateEditInput,
} from 'schema';
import GoalSuggestionTemplate from '../models/goal-suggestion-template';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

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
  root: any, { input }: IGoalSuggestionTemplatesCreateArgs, context: IContext,
) {
  const { userRole } = context;
  await accessControls.isAllowed(userRole, 'create', 'goalSuggestionTemplate');

  return await GoalSuggestionTemplate.create(input);
}

export async function resolveGoalSuggestionTemplates(
  root: any, args: any, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestionTemplate');

  return await GoalSuggestionTemplate.getAll();
}

export async function resolveGoalSuggestionTemplate(
  root: any, args: { goalSuggestionTemplateId: string }, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestionTemplate');

  return await GoalSuggestionTemplate.get(args.goalSuggestionTemplateId);
}

export async function goalSuggestionTemplateEdit(
  root: any, args: IEditGoalSuggestionTemplateOptions, { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'goalSuggestionTemplate');

  return GoalSuggestionTemplate.edit(args.input.goalSuggestionTemplateId, args.input);
}

export async function goalSuggestionTemplateDelete(
  root: any, args: IDeleteGoalSuggestionTemplateOptions, { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'goalSuggestionTemplate');

  return GoalSuggestionTemplate.delete(args.input.goalSuggestionTemplateId);
}
