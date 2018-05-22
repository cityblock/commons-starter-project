import { transaction } from 'objection';
import {
  IQuestionCreateInput,
  IQuestionDeleteInput,
  IQuestionEditInput,
  IRootMutationType,
  IRootQueryType,
  QuestionFilterType,
} from 'schema';
import Question from '../models/question';
import checkUserPermissions from './shared/permissions-check';
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

export async function questionCreate(
  root: any,
  { input }: IQuestionCreateArgs,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['questionCreate']> {
  return transaction(testTransaction || Question.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'question', txn);

    const question = {
      order: input.order,
      title: input.title,
      answerType: input.answerType,
      validatedSource: input.validatedSource || undefined,
      applicableIfType: input.applicableIfType || undefined,
      computedFieldId: input.computedFieldId || undefined,
      hasOtherTextAnswer: input.hasOtherTextAnswer || false,
    };

    // A bit verbose to handle the typings
    if (input.riskAreaId) {
      return Question.create(
        {
          type: 'riskArea',
          riskAreaId: input.riskAreaId,
          ...question,
        },
        txn,
      );
    } else if (input.screeningToolId) {
      return Question.create(
        {
          type: 'screeningTool',
          screeningToolId: input.screeningToolId,
          ...question,
        },
        txn,
      );
    } else if (input.progressNoteTemplateId) {
      return Question.create(
        {
          type: 'progressNoteTemplate',
          progressNoteTemplateId: input.progressNoteTemplateId,
          ...question,
        },
        txn,
      );
    }
    return null;
  });
}

export async function resolveQuestions(
  root: any,
  args: { filterId: string; filterType: QuestionFilterType },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['questions']> {
  return transaction(testTransaction || Question.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'question', txn);

    if (args.filterType === 'riskArea') {
      return Question.getAllForRiskArea(args.filterId, txn);
    } else if (args.filterType === 'screeningTool') {
      return Question.getAllForScreeningTool(args.filterId, txn);
    } else if (args.filterType === 'progressNoteTemplate') {
      return Question.getAllForProgressNoteTemplate(args.filterId, txn);
    } else {
      throw new Error('invalid filter type');
    }
  });
}

export async function resolveQuestion(
  root: any,
  args: { questionId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['question']> {
  return transaction(testTransaction || Question.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'question', txn);

    return Question.get(args.questionId, txn);
  });
}

export async function questionEdit(
  root: any,
  args: IEditQuestionOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['questionEdit']> {
  return transaction(testTransaction || Question.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'question', txn);

    // TODO: fix typings here
    return Question.edit(args.input as any, args.input.questionId, txn);
  });
}

export async function questionDelete(
  root: any,
  args: IDeleteQuestionOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['questionEdit']> {
  return transaction(testTransaction || Question.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'question', txn);

    return Question.delete(args.input.questionId, txn);
  });
}
