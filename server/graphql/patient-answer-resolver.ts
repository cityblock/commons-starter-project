import { transaction } from 'objection';
import {
  IAnswerFilterTypeEnum,
  IPatientAnswersCreateInput,
  IPatientAnswerDeleteInput,
  IPatientAnswerEditInput,
} from 'schema';
import PatientAnswer from '../models/patient-answer';
import accessControls from './shared/access-controls';
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

export async function patientAnswersCreate(
  root: any,
  { input }: IPatientAnswersCreateArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  const existingTxn = context.txn;
  await accessControls.isAllowed(userRole, 'create', 'patientAnswer');
  checkUserLoggedIn(userId);

  const {
    patientAnswers,
    patientId,
    questionIds,
    patientScreeningToolSubmissionId,
    riskAreaAssessmentSubmissionId,
    progressNoteId,
  } = input;

  return await transaction(PatientAnswer.knex(), async txn => {
    if (progressNoteId) {
      return await PatientAnswer.create(
        {
          patientId,
          questionIds,
          progressNoteId,
          type: 'progressNote',
          answers: patientAnswers.map(patientAnswer => ({
            ...patientAnswer,
            userId: userId!,
          })),
        },
        existingTxn || txn,
      );
    } else if (patientScreeningToolSubmissionId) {
      return await PatientAnswer.create(
        {
          patientId,
          questionIds,
          type: 'patientScreeningToolSubmission',
          patientScreeningToolSubmissionId,
          answers: patientAnswers.map(patientAnswer => ({
            ...patientAnswer,
            userId: userId!,
          })),
        },
        existingTxn || txn,
      );
    } else if (riskAreaAssessmentSubmissionId) {
      return await PatientAnswer.create(
        {
          patientId,
          questionIds,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId,
          answers: patientAnswers.map(patientAnswer => ({
            ...patientAnswer,
            userId: userId!,
          })),
        },
        existingTxn || txn,
      );
    } else {
      throw new Error(
        'either riskAreaAssessmentSubmissionId, patientScreeningToolSubmissionId or' +
          ' progressNoteId are required',
      );
    }
  });
}

export async function resolvePatientAnswers(
  root: any,
  args: { filterId: string; filterType: IAnswerFilterTypeEnum; patientId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  if (args.filterType === 'question') {
    return await PatientAnswer.getForQuestion(args.filterId, args.patientId, txn);
  } else if (args.filterType === 'riskArea') {
    return await PatientAnswer.getForRiskArea(args.filterId, args.patientId, txn);
  } else if (args.filterType === 'screeningTool') {
    return await PatientAnswer.getForScreeningTool(args.filterId, args.patientId, txn);
  } else if (args.filterType === 'patientScreeningToolSubmission') {
    return await PatientAnswer.getForScreeningToolSubmission(args.filterId, txn);
  } else if (args.filterType === 'progressNote') {
    return await PatientAnswer.getForProgressNote(args.filterId, args.patientId, txn);
  } else {
    throw new Error('wrong filter type');
  }
}

export async function resolvePreviousPatientAnswersForQuestion(
  root: any,
  args: { questionId: string; patientId: string },
  { db, userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.getPreviousAnswersForQuestion(args.questionId, args.patientId, txn);
}

export async function resolvePatientAnswer(
  root: any,
  args: { patientAnswerId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.get(args.patientAnswerId, txn);
}

export async function patientAnswerEdit(
  root: any,
  args: IEditPatientAnswerOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientAnswer');
  checkUserLoggedIn(userId);

  return PatientAnswer.editApplicable(args.input.applicable, args.input.patientAnswerId, txn);
}

export async function patientAnswerDelete(
  root: any,
  args: IDeletePatientAnswerOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientAnswer');
  checkUserLoggedIn(userId);

  return PatientAnswer.delete(args.input.patientAnswerId, txn);
}
