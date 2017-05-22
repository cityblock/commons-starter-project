import { IPatient, IPatientHealthRecord } from 'schema';
import { formatPatientHealthRecord } from '../apis/athena/formatters';
import Patient from '../models/patient';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

interface IQuery {
  patientId: string;
}

export async function resolvePatient(
  root: any,
  { patientId }: IQuery,
  { athenaApi, userRole, userId }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  return await Patient.get(patientId);
}

export async function resolvePatientHealthRecord(
  root: any,
  { patientId }: IQuery,
  { athenaApi, userRole, userId }: IContext,
): Promise<IPatientHealthRecord> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const athenaPatientId = await Patient.getAthenaPatientId(patientId);
  const athenaPatient = await athenaApi.getPatient(athenaPatientId);

  return await formatPatientHealthRecord(athenaPatient, patientId);
}
