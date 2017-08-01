import { pickBy } from 'lodash';
import { IQuestionCreateInput, IQuestionDeleteInput, IQuestionEditInput } from 'schema';
import Question from '../models/question';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IQuestionCreateArgs {
  input: IQuestionCreateInput;
}

export interface IResolveQuestionOptions {
  questionId: string;
}

export interface IEditQuestionOptions {
  input: IQuestionEditInput;
}

export interface IDeleteQuestionOptions {
  input: IQuestionDeleteInput;
}

export async function questionCreate(root: any, { input }: IQuestionCreateArgs, context: IContext) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'question');
  if (!userId) {
    throw new Error('not logged in');
  }

  // TODO: fix typings here
  return await Question.create(input as any);
}

export async function resolveQuestionsForRiskArea(
  root: any, args: { riskAreaId: string }, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'question');

  return await Question.getAllForRiskArea(args.riskAreaId);
}

export async function resolveQuestion(
  root: any, args: { questionId: string }, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'question');

  return await Question.get(args.questionId);
}

export async function questionEdit(
  root: any, args: IEditQuestionOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'question');
  if (!userId) {
    throw new Error('not logged in');
  }
  // TODO: fix typings here
  const cleanedParams = pickBy<IQuestionEditInput, {}>(args.input) as any;
  return Question.edit(cleanedParams, args.input.questionId);
}

export async function questionDelete(
  root: any, args: IDeleteQuestionOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'question');
  if (!userId) {
    throw new Error('not logged in');
  }
  return Question.delete(args.input.questionId);
}
