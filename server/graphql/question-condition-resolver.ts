import { transaction } from 'objection';
import {
  IQuestionConditionCreateInput,
  IQuestionConditionDeleteInput,
  IQuestionConditionEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import QuestionCondition from '../models/question-condition';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['questionConditionCreate']> {
  return transaction(testTransaction || QuestionCondition.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'questionCondition', txn);

    return QuestionCondition.create(input, txn);
  });
}

export async function resolveQuestionCondition(
  root: any,
  args: { questionConditionId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['questionCondition']> {
  return transaction(testTransaction || QuestionCondition.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'questionCondition', txn);

    return QuestionCondition.get(args.questionConditionId, txn);
  });
}

export async function questionConditionEdit(
  root: any,
  args: IEditQuestionConditionOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['questionConditionEdit']> {
  return transaction(testTransaction || QuestionCondition.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'questionCondition', txn);

    return QuestionCondition.edit(args.input, args.input.questionConditionId, txn);
  });
}

export async function questionConditionDelete(
  root: any,
  args: IDeleteQuestionConditionOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['questionConditionDelete']> {
  return transaction(testTransaction || QuestionCondition.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'questionCondition', txn);

    return QuestionCondition.delete(args.input.questionConditionId, txn);
  });
}
