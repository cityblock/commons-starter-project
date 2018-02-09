import {
  IQuestionConditionCreateInput,
  IQuestionConditionDeleteInput,
  IQuestionConditionEditInput,
  IRootMutationType,
  IRootQueryType,
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
  root: any,
  { input }: IQuestionConditionCreateArgs,
  context: IContext,
): Promise<IRootMutationType['questionConditionCreate']> {
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'questionCondition');
  checkUserLoggedIn(userId);

  return QuestionCondition.create(input, txn);
}

export async function resolveQuestionCondition(
  root: any,
  args: { questionConditionId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['questionCondition']> {
  await accessControls.isAllowed(userRole, 'view', 'questionCondition');

  return QuestionCondition.get(args.questionConditionId, txn);
}

export async function questionConditionEdit(
  root: any,
  args: IEditQuestionConditionOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['questionConditionEdit']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'questionCondition');
  checkUserLoggedIn(userId);

  return QuestionCondition.edit(args.input, args.input.questionConditionId, txn);
}

export async function questionConditionDelete(
  root: any,
  args: IDeleteQuestionConditionOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['questionConditionDelete']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'questionCondition');
  checkUserLoggedIn(userId);

  return QuestionCondition.delete(args.input.questionConditionId, txn);
}
