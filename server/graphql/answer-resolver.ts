import { pickBy } from 'lodash';
import {
  IAnswerCreateInput,
  IAnswerDeleteInput,
  IAnswerEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import Answer from '../models/answer';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IAnswerCreateArgs {
  input: IAnswerCreateInput;
}

export interface IResolveAnswerOptions {
  answerId: string;
}

export interface IEditAnswerOptions {
  input: IAnswerEditInput;
}

export interface IDeleteAnswerOptions {
  input: IAnswerDeleteInput;
}

export async function answerCreate(root: any, { input }: IAnswerCreateArgs, context: IContext) {
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'answer');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return Answer.create(input as any, txn);
}

export async function resolveAnswersForQuestion(
  root: any,
  args: { questionId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'answer');

  return Answer.getAllForQuestion(args.questionId, txn);
}

export async function resolveAnswer(
  root: any,
  args: { answerId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['answer']> {
  await accessControls.isAllowed(userRole, 'view', 'answer');

  return Answer.get(args.answerId, txn);
}

export async function answerEdit(
  root: any,
  args: IEditAnswerOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['answerEdit']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'answer');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  const cleanedParams = pickBy<IAnswerEditInput>(args.input) as any;
  return Answer.edit(cleanedParams, args.input.answerId, txn);
}

export async function answerDelete(
  root: any,
  args: IDeleteAnswerOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['answerDelete']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'answer');
  checkUserLoggedIn(userId);

  return Answer.delete(args.input.answerId, txn);
}
