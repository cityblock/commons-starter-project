import {
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
  root: any, { input }: IPatientAnswersCreateArgs, context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientAnswer');
  checkUserLoggedIn(userId);

  const { patientAnswers, patientId, questionIds } = input;

  return await PatientAnswer.create({
    patientId,
    questionIds,
    answers: patientAnswers.map(patientAnswer => ({ ...patientAnswer, userId: userId! })),
  });
}

export async function resolvePatientAnswersForQuestion(
  root: any, args: { questionId: string, patientId: string }, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.getForQuestion(args.questionId, args.patientId);
}

export async function resolvePreviousPatientAnswersForQuestion(
  root: any, args: { questionId: string, patientId: string }, { db, userRole, userId }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.getPreviousAnswersForQuestion(args.questionId, args.patientId);
}

export async function resolvePatientAnswersForRiskArea(
  root: any, args: { riskAreaId: string, patientId: string }, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.getForRiskArea(args.riskAreaId, args.patientId, 'question');
}

export async function resolvePatientAnswer(
  root: any, args: { patientAnswerId: string }, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientAnswer');

  return await PatientAnswer.get(args.patientAnswerId);
}

export async function patientAnswerEdit(
  root: any, args: IEditPatientAnswerOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientAnswer');
  checkUserLoggedIn(userId);

  return PatientAnswer.editApplicable(args.input.applicable, args.input.patientAnswerId);
}

export async function patientAnswerDelete(
  root: any, args: IDeletePatientAnswerOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientAnswer');
  checkUserLoggedIn(userId);

  return PatientAnswer.delete(args.input.patientAnswerId);
}
