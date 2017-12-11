import { transaction } from 'objection';
import {
  IAnswerFilterTypeEnum,
  IPatientAnswersCreateInput,
  IPatientAnswersUpdateApplicableInput,
  IPatientAnswerDeleteInput,
  IPatientAnswerEditInput,
} from 'schema';
import PatientAnswer from '../models/patient-answer';
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

  const {
    patientAnswers,
    patientId,
    questionIds,
    patientScreeningToolSubmissionId,
    progressNoteId,
  } = input;

  return await transaction(PatientAnswer.knex(), async txn => {
    return await PatientAnswer.create(
      {
        patientId,
        questionIds,
        progressNoteId: progressNoteId || undefined,
        patientScreeningToolSubmissionId: patientScreeningToolSubmissionId || undefined,
        answers: patientAnswers.map(patientAnswer => ({
          ...patientAnswer,
          userId: userId!,
        })),
      },
      txn,
    );
  });
}

export async function resolvePatientAnswers(
  root: any,
  args: { filterId: string; filterType: IAnswerFilterTypeEnum; patientId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  const eagerQuery = '[answer, question]';

  if (args.filterType === 'question') {
    return await PatientAnswer.getForQuestion(args.filterId, args.patientId, eagerQuery);
  } else if (args.filterType === 'riskArea') {
    return await PatientAnswer.getForRiskArea(args.filterId, args.patientId, eagerQuery);
  } else if (args.filterType === 'screeningTool') {
    return await PatientAnswer.getForScreeningTool(args.filterId, args.patientId, eagerQuery);
  } else if (args.filterType === 'patientScreeningToolSubmission') {
    return await PatientAnswer.getForScreeningToolSubmission(args.filterId, eagerQuery);
  } else if (args.filterType === 'progressNote') {
    return await PatientAnswer.getForProgressNote(args.filterId, args.patientId, eagerQuery);
  } else {
    throw new Error('wrong filter type');
  }
}

export async function resolvePreviousPatientAnswersForQuestion(
  root: any,
  args: { questionId: string; patientId: string },
  { db, userRole, userId }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.getPreviousAnswersForQuestion(args.questionId, args.patientId);
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
