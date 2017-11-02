import { pickBy } from 'lodash';
import {
  IPatientScreeningToolSubmissionCreateInput,
  IPatientScreeningToolSubmissionDeleteInput,
  IPatientScreeningToolSubmissionEditInput,
} from 'schema';
import PatientScreeningToolSubmission from '../models/patient-screening-tool-submission';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IPatientScreeningToolSubmissionCreateArgs {
  input: IPatientScreeningToolSubmissionCreateInput;
}

export interface IResolvePatientScreeningToolSubmissionOptions {
  patientScreeningToolSubmissionId: string;
}

export interface IResolvePatientScreeningToolSubmissionsOptions {
  patientId: string;
  screeningToolId?: string;
}

export interface IEditPatientScreeningToolSubmissionOptions {
  input: IPatientScreeningToolSubmissionEditInput;
}

export interface IDeletePatientScreeningToolSubmissionOptions {
  input: IPatientScreeningToolSubmissionDeleteInput;
}

export async function patientScreeningToolSubmissionCreate(
  root: any,
  { input }: IPatientScreeningToolSubmissionCreateArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientScreeningToolSubmission');
  checkUserLoggedIn(userId);

  return await PatientScreeningToolSubmission.create(input as any);
}

export async function patientScreeningToolSubmissionEdit(
  rot: any,
  args: IEditPatientScreeningToolSubmissionOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientScreeningToolSubmission');
  checkUserLoggedIn(userId);

  const cleanedParams = pickBy<IPatientScreeningToolSubmissionEditInput, {}>(args.input) as any;
  return await PatientScreeningToolSubmission.edit(
    args.input.patientScreeningToolSubmissionId,
    cleanedParams,
  );
}

export async function resolvePatientScreeningToolSubmission(
  root: any,
  args: { patientScreeningToolSubmissionId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return await PatientScreeningToolSubmission.get(args.patientScreeningToolSubmissionId);
}

export async function resolvePatientScreeningToolSubmissionForPatientAndScreeningTool(
  root: any,
  args: { screeningToolId: string; patientId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return await PatientScreeningToolSubmission.getLatestForPatientAndScreeningTool(
    args.screeningToolId,
    args.patientId,
  );
}

export async function resolvePatientScreeningToolSubmissionsForPatient(
  root: any,
  args: IResolvePatientScreeningToolSubmissionsOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return await PatientScreeningToolSubmission.getForPatient(args.patientId, args.screeningToolId);
}

export async function resolvePatientScreeningToolSubmissions(
  root: any,
  args: any,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return await PatientScreeningToolSubmission.getAll();
}

export async function patientScreeningToolSubmissionDelete(
  root: any,
  args: IDeletePatientScreeningToolSubmissionOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'delete', 'patientScreeningToolSubmission');
  checkUserLoggedIn(userId);

  return await PatientScreeningToolSubmission.delete(args.input.patientScreeningToolSubmissionId);
}
