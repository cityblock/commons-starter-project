import { pickBy } from 'lodash';
import {
  IQuestionCreateInput,
  IQuestionDeleteInput,
  IQuestionEditInput,
  IQuestionFilterTypeEnum,
} from 'schema';
import Question from '../models/question';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

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
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return await Question.create(input as any);
}

export async function resolveQuestions(
  root: any,
  args: { filterId: string; filterType: IQuestionFilterTypeEnum },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'question');

  if (args.filterType === 'riskArea') {
    return await Question.getAllForRiskArea(args.filterId);
  } else if (args.filterType === 'screeningTool') {
    return await Question.getAllForScreeningTool(args.filterId);
  } else if (args.filterType === 'progressNoteTemplate') {
    return await Question.getAllForProgressNoteTemplate(args.filterId);
  } else {
    throw new Error('invalid filter type');
  }
}

export async function resolveQuestion(
  root: any,
  args: { questionId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'question');

  return await Question.get(args.questionId);
}

export async function questionEdit(
  root: any,
  args: IEditQuestionOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'question');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  const cleanedParams = pickBy<IQuestionEditInput, {}>(args.input) as any;
  return Question.edit(cleanedParams, args.input.questionId);
}

export async function questionDelete(
  root: any,
  args: IDeleteQuestionOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'question');
  checkUserLoggedIn(userId);

  return Question.delete(args.input.questionId);
}
