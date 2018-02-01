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
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'question');
  checkUserLoggedIn(userId);

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
}

export async function resolveQuestions(
  root: any,
  args: { filterId: string; filterType: IQuestionFilterTypeEnum },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'question');

  if (args.filterType === 'riskArea') {
    return Question.getAllForRiskArea(args.filterId, txn);
  } else if (args.filterType === 'screeningTool') {
    return Question.getAllForScreeningTool(args.filterId, txn);
  } else if (args.filterType === 'progressNoteTemplate') {
    return Question.getAllForProgressNoteTemplate(args.filterId, txn);
  } else {
    throw new Error('invalid filter type');
  }
}

export async function resolveQuestion(
  root: any,
  args: { questionId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'question');

  return Question.get(args.questionId, txn);
}

export async function questionEdit(
  root: any,
  args: IEditQuestionOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'question');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return Question.edit(args.input as any, args.input.questionId, txn);
}

export async function questionDelete(
  root: any,
  args: IDeleteQuestionOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'question');
  checkUserLoggedIn(userId);

  return Question.delete(args.input.questionId, txn);
}
