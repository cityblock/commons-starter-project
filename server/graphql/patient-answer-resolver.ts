import {
  IAnswerFilterTypeEnum,
  IPatientAnswersCreateInput,
  IPatientAnswerDeleteInput,
  IPatientAnswerEditInput,
  IRootMutationType,
  IRootQueryType,
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
): Promise<IRootMutationType['patientAnswersCreate']> {
  const { userRole, userId, txn } = context;
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

  if (progressNoteId) {
    return PatientAnswer.create(
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
      txn,
    );
  } else if (patientScreeningToolSubmissionId) {
    return PatientAnswer.create(
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
      txn,
    );
  } else if (riskAreaAssessmentSubmissionId) {
    return PatientAnswer.create(
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
      txn,
    );
  } else {
    throw new Error(
      'either riskAreaAssessmentSubmissionId, patientScreeningToolSubmissionId or' +
        ' progressNoteId are required',
    );
  }
}

export async function resolvePatientAnswers(
  root: any,
  args: { filterId: string; filterType: IAnswerFilterTypeEnum; patientId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['patientAnswers']> {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  if (args.filterType === 'question') {
    return PatientAnswer.getForQuestion(args.filterId, args.patientId, txn);
  } else if (args.filterType === 'riskArea') {
    return PatientAnswer.getForRiskArea(args.filterId, args.patientId, txn);
  } else if (args.filterType === 'screeningTool') {
    return PatientAnswer.getForScreeningTool(args.filterId, args.patientId, txn);
  } else if (args.filterType === 'patientScreeningToolSubmission') {
    return PatientAnswer.getForScreeningToolSubmission(args.filterId, txn);
  } else if (args.filterType === 'progressNote') {
    return PatientAnswer.getForProgressNote(args.filterId, args.patientId, txn);
  } else {
    throw new Error('wrong filter type');
  }
}

export async function resolvePreviousPatientAnswersForQuestion(
  root: any,
  args: { questionId: string; patientId: string },
  { db, userRole, userId, txn }: IContext,
): Promise<IRootQueryType['patientPreviousAnswersForQuestion']> {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return PatientAnswer.getPreviousAnswersForQuestion(args.questionId, args.patientId, txn);
}

export async function resolvePatientAnswer(
  root: any,
  args: { patientAnswerId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['patientAnswer']> {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return PatientAnswer.get(args.patientAnswerId, txn);
}

export async function patientAnswerEdit(
  root: any,
  args: IEditPatientAnswerOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['patientAnswerEdit']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientAnswer');
  checkUserLoggedIn(userId);

  return PatientAnswer.editApplicable(args.input.applicable, args.input.patientAnswerId, txn);
}

export async function patientAnswerDelete(
  root: any,
  args: IDeletePatientAnswerOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['patientAnswerDelete']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientAnswer');
  checkUserLoggedIn(userId);

  return PatientAnswer.delete(args.input.patientAnswerId, txn);
}
