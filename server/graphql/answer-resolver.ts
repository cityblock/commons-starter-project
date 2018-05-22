import { pickBy } from 'lodash';
import { transaction } from 'objection';
import {
  IAnswerCreateInput,
  IAnswerDeleteInput,
  IAnswerEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import Answer from '../models/answer';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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

export async function answerCreate(
  root: any,
  { input }: IAnswerCreateArgs,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['answerCreate']> {
  return transaction(testTransaction || Answer.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'answer', txn);

    return Answer.create(
      {
        questionId: input.questionId,
        displayValue: input.displayValue,
        value: input.value,
        valueType: input.valueType,
        riskAdjustmentType: input.riskAdjustmentType,
        inSummary: input.inSummary ? true : false,
        order: input.order,
      },
      txn,
    );
  });
}

export async function resolveAnswersForQuestion(
  root: any,
  args: { questionId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['answersForQuestion']> {
  return transaction(testTransaction || Answer.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'answer', txn);

    return Answer.getAllForQuestion(args.questionId, txn);
  });
}

export async function resolveAnswer(
  root: any,
  args: { answerId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['answer']> {
  return transaction(testTransaction || Answer.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'answer', txn);

    return Answer.get(args.answerId, txn);
  });
}

export async function answerEdit(
  root: any,
  args: IEditAnswerOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['answerEdit']> {
  return transaction(testTransaction || Answer.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'answer', txn);

    // TODO: fix typings here
    const cleanedParams = pickBy<IAnswerEditInput>(args.input) as any;
    return Answer.edit(cleanedParams, args.input.answerId, txn);
  });
}

export async function answerDelete(
  root: any,
  args: IDeleteAnswerOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['answerDelete']> {
  return transaction(testTransaction || Answer.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'answer', txn);

    return Answer.delete(args.input.answerId, txn);
  });
}
