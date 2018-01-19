import { IPatientEncounter } from 'schema';
import { formatPatientEncounters } from '../apis/redox/formatters';
import { IPaginationOptions } from '../db';
import Patient from '../models/patient';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IResolvePatientEncountersOptions extends IPaginationOptions {
  patientId: string;
}

export async function resolvePatientEncounters(
  root: any,
  { patientId }: IResolvePatientEncountersOptions,
  { userRole, redoxApi, userId, txn }: IContext,
): Promise<IPatientEncounter[]> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const patient = await Patient.get(patientId, txn);

  const id = String(patient.athenaPatientId);
  const patientClinicalSummaryResponse = await redoxApi.patientEncountersGet(id);

  return formatPatientEncounters(patientClinicalSummaryResponse.Encounters);
}
