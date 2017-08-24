import { pickBy } from 'lodash';
import {
  IQuestionConditionCreateInput, IQuestionConditionDeleteInput, IQuestionConditionEditInput,
} from 'schema';
import QuestionCondition from '../models/question-condition';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IQuestionConditionCreateArgs {
  input: IQuestionConditionCreateInput;
}

export interface IResolveQuestionConditionOptions {
  questionConditionId: string;
}

export interface IEditQuestionConditionOptions {
  input: IQuestionConditionEditInput;
}

export interface IDeleteQuestionConditionOptions {
  input: IQuestionConditionDeleteInput;
}

export async function questionConditionCreate(
  root: any, { input }: IQuestionConditionCreateArgs, context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'questionCondition');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return await QuestionCondition.create(input as any);
}

export async function resolveQuestionCondition(
  root: any, args: { questionConditionId: string }, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'questionCondition');

  return await QuestionCondition.get(args.questionConditionId);
}

export async function questionConditionEdit(
  root: any, args: IEditQuestionConditionOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'questionCondition');
  checkUserLoggedIn(userId);

  const cleanedParams = pickBy<IQuestionConditionEditInput, {}>(args.input) as any;
  return QuestionCondition.edit(cleanedParams, args.input.questionConditionId);
}

export async function questionConditionDelete(
  root: any, args: IDeleteQuestionConditionOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'questionCondition');
  checkUserLoggedIn(userId);

  return QuestionCondition.delete(args.input.questionConditionId);
}
