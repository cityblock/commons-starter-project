import {
  AnswerFilterType,
  IPatientAnswersCreateInput,
  IPatientAnswerDeleteInput,
  IPatientAnswerEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import PatientAnswer from '../models/patient-answer';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientAnswersCreate']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const {
    patientAnswers,
    patientId,
    questionIds,
    patientScreeningToolSubmissionId,
    riskAreaAssessmentSubmissionId,
    progressNoteId,
  } = input;

  if (progressNoteId) {
    return PatientAnswer.createForProgressNote(
      {
        patientId,
        questionIds,
        progressNoteId,
        answers: patientAnswers.map(patientAnswer => ({
          ...patientAnswer,
          userId: userId!,
        })),
      },
      txn,
    );
  } else if (patientScreeningToolSubmissionId) {
    return PatientAnswer.createForScreeningTool(
      {
        patientId,
        questionIds,
        patientScreeningToolSubmissionId,
        answers: patientAnswers.map(patientAnswer => ({
          ...patientAnswer,
          userId: userId!,
        })),
      },
      txn,
    );
  } else if (riskAreaAssessmentSubmissionId) {
    return PatientAnswer.createForRiskArea(
      {
        patientId,
        questionIds,
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
  args: { filterId: string; filterType: AnswerFilterType; patientId: string },
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['patientAnswers']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  if (args.filterType === 'question') {
    return PatientAnswer.getForQuestion(args.filterId, args.patientId, txn);
  } else if (args.filterType === 'riskArea') {
    return PatientAnswer.getForRiskArea(args.filterId, args.patientId, txn);
  } else if (args.filterType === 'screeningTool') {
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
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientPreviousAnswersForQuestion']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return PatientAnswer.getPreviousAnswersForQuestion(args.questionId, args.patientId, txn);
}

export async function resolvePatientAnswer(
  root: any,
  args: { patientAnswerId: string },
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['patientAnswer']> {
  await checkUserPermissions(
    userId,
    permissions,
    'view',
    'patientAnswer',
    txn,
    args.patientAnswerId,
  );

  return PatientAnswer.get(args.patientAnswerId, txn);
}

export async function patientAnswerEdit(
  root: any,
  args: IEditPatientAnswerOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['patientAnswerEdit']> {
  await checkUserPermissions(
    userId,
    permissions,
    'edit',
    'patientAnswer',
    txn,
    args.input.patientAnswerId,
  );

  return PatientAnswer.editApplicable(args.input.applicable, args.input.patientAnswerId, txn);
}

export async function patientAnswerDelete(
  root: any,
  args: IDeletePatientAnswerOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['patientAnswerDelete']> {
  await checkUserPermissions(
    userId,
    permissions,
    'delete',
    'patientAnswer',
    txn,
    args.input.patientAnswerId,
  );

  return PatientAnswer.delete(args.input.patientAnswerId, txn);
}
