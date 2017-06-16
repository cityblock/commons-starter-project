import { IPatientMedications } from 'schema';
import { formatPatientMedications } from '../apis/redox/formatters';
import Patient from '../models/patient';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IResolvePatientMedicationsOptions {
  patientId: string;
}

export async function resolvePatientMedications(
  root: any,
  { patientId }: IResolvePatientMedicationsOptions,
  { userRole, redoxApi, userId }: IContext,
): Promise<IPatientMedications> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const patient = await Patient.get(patientId);

  const id = String(patient.athenaPatientId);
  const medicationsResponse = await redoxApi.patientMedicationsGet(id);

  return formatPatientMedications(medicationsResponse.Medications);
}
