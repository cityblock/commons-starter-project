import { IPatient } from 'schema';
import AthenaApi from '../apis/athena';
import { formatPatient } from '../apis/athena/formatter';
import Patient from '../models/patient';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

interface IQuery {
  patientId: string;
}

export async function getFullPatient(patient: Patient, athenaApi: AthenaApi): Promise<IPatient> {
  const athenaPatient = await athenaApi.getPatient(patient.athenaPatientId);

  return await formatPatient(athenaPatient, patient);
}

export async function resolvePatient(
  root: any,
  { patientId }: IQuery,
  { athenaApi, userRole, userId }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const patient = await Patient.get(patientId);
  return await getFullPatient(patient, athenaApi);
}

interface ICareTeamOptions {
  input: {
    userId: string;
    patientId: string;
  };
}

export async function addUserToCareTeam(
  source: any, { input }: ICareTeamOptions, context: IContext,
) {
  const { userRole } = context;
  const { userId, patientId } = input;
  await accessControls.isAllowed(userRole, 'edit', 'patient');

  return await Patient.addUserToCareTeam(userId, patientId);
}

export async function removeUserFromCareTeam(
  source: any, { input }: ICareTeamOptions, context: IContext,
) {
  const { userRole } = context;
  const { userId, patientId } = input;
  await accessControls.isAllowed(userRole, 'edit', 'patient');

  return await Patient.removeUserFromCareTeam(userId, patientId);
}
