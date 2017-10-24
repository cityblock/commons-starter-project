import { omit } from 'lodash';
import { transaction } from 'objection';
import {
  IPatientAnswersCreateInput,
  IPatientAnswersUpdateApplicableInput,
  IPatientAnswerDeleteInput,
  IPatientAnswerEditInput,
} from 'schema';
import Answer from '../models/answer';
import CarePlanSuggestion from '../models/care-plan-suggestion';
import ConcernSuggestion from '../models/concern-suggestion';
import GoalSuggestion from '../models/goal-suggestion';
import PatientAnswer from '../models/patient-answer';
import PatientScreeningToolSubmission from '../models/patient-screening-tool-submission';
import Question from '../models/question';
import accessControls from './shared/access-controls';
import { updatePatientAnswerApplicable } from './shared/answer-applicable';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IPatientAnswersCreateArgs {
  input: IPatientAnswersCreateInput;
}

export interface IResolvePatientAnswerOptions {
  answerId: string;
}

export interface IEditPatientAnswerOptions {
  input: IPatientAnswerEditInput;
}

export interface IDeletePatientAnswerOptions {
  input: IPatientAnswerDeleteInput;
}

export interface IPatietnAnswserUpdateApplicableOptions {
  input: IPatientAnswersUpdateApplicableInput;
}

export async function patientAnswersUpdateApplicable(
  root: any,
  { input }: IPatietnAnswserUpdateApplicableOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'create', 'patientAnswer');

  // TODO add transactions
  const patientAnswers = await PatientAnswer.getForRiskArea(input.riskAreaId, input.patientId);
  const questions = await Question.getAllForRiskArea(input.riskAreaId);
  return await Promise.all(updatePatientAnswerApplicable(patientAnswers, questions));
}

export async function patientAnswersCreate(
  root: any,
  { input }: IPatientAnswersCreateArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientAnswer');
  checkUserLoggedIn(userId);

  const { patientAnswers, patientId, questionIds, screeningToolId } = input;

  return await transaction(PatientAnswer.knex(), async txn => {
    let patientScreeningToolSubmissionId: string | undefined;

    if (!!screeningToolId) {
      const answerIds = patientAnswers.map(patientAnswer => patientAnswer.answerId);
      const answers = await Answer.getMultiple(answerIds, txn);
      const formattedPatientAnswers = patientAnswers.map(patientAnswer => ({
        answer: answers.find(answer => answer.id === patientAnswer.answerId),
        ...patientAnswer,
      }));

      const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create(
        {
          screeningToolId,
          patientId,
          userId: userId!,
          patientAnswers: omit(formattedPatientAnswers, ['id']),
        },
        txn,
      );

      patientScreeningToolSubmissionId = patientScreeningToolSubmission.id;
    }

    const createdAnswers = await PatientAnswer.create(
      {
        patientId,
        questionIds,
        patientScreeningToolSubmissionId,
        answers: patientAnswers.map(patientAnswer => ({
          ...patientAnswer,
          userId: userId!,
          patientScreeningToolSubmissionId,
        })),
      },
      txn,
    );

    const newConcernSuggestions = await ConcernSuggestion.getNewForPatient(patientId, txn);
    const newGoalSuggestions = await GoalSuggestion.getNewForPatient(patientId, txn);
    const formattedConcernSuggestions = newConcernSuggestions.map(concernSuggestion => ({
      patientId,
      suggestionType: 'concern' as any,
      concernId: concernSuggestion.id,
      patientScreeningToolSubmissionId,
    }));
    const formattedGoalSuggestions = newGoalSuggestions.map(goalSuggestion => ({
      patientId,
      suggestionType: 'goal' as any,
      goalSuggestionTemplateId: goalSuggestion.id,
      patientScreeningToolSubmissionId,
    }));

    const suggestions = formattedConcernSuggestions.concat(formattedGoalSuggestions as any);

    if (suggestions.length) {
      await CarePlanSuggestion.createMultiple({ suggestions }, txn);
    }

    return createdAnswers;
  });
}

export async function resolvePatientAnswersForQuestion(
  root: any,
  args: { questionId: string; patientId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.getForQuestion(args.questionId, args.patientId);
}

export async function resolvePreviousPatientAnswersForQuestion(
  root: any,
  args: { questionId: string; patientId: string },
  { db, userRole, userId }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.getPreviousAnswersForQuestion(args.questionId, args.patientId);
}

export async function resolvePatientAnswersForRiskArea(
  root: any,
  args: { riskAreaId: string; patientId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.getForRiskArea(args.riskAreaId, args.patientId, 'question');
}

export async function resolvePatientAnswersForScreeningTool(
  root: any,
  args: { screeningToolId: string; patientId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.getForScreeningTool(args.screeningToolId, args.patientId, 'question');
}

export async function resolvePatientAnswer(
  root: any,
  args: { patientAnswerId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.get(args.patientAnswerId);
}

export async function patientAnswerEdit(
  root: any,
  args: IEditPatientAnswerOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientAnswer');
  checkUserLoggedIn(userId);

  return PatientAnswer.editApplicable(args.input.applicable, args.input.patientAnswerId);
}

export async function patientAnswerDelete(
  root: any,
  args: IDeletePatientAnswerOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientAnswer');
  checkUserLoggedIn(userId);

  return PatientAnswer.delete(args.input.patientAnswerId);
}
