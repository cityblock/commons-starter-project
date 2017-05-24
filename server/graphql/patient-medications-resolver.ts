import { IPatientMedications } from 'schema';
import { formatPatientMedications } from '../apis/athena/formatters';
import Clinic from '../models/clinic';
import Patient from '../models/patient';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

interface IResolvePatientMedicationsOptions {
  patientId: string;
}

export async function resolvePatientMedications(
  root: any,
  { patientId }: IResolvePatientMedicationsOptions,
  { userRole, athenaApi, userId }: IContext,
): Promise<IPatientMedications> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const patient = await Patient.get(patientId);
  const clinic = await Clinic.get(patient.homeClinicId);

  const medicationsResponse = await athenaApi.patientMedicationsGet(
    patient.athenaPatientId,
    clinic.departmentId,
  );

  return formatPatientMedications(medicationsResponse);
}
