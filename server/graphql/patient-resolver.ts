import { isNil, omitBy } from 'lodash';
import { IPatient, IPatientEditInput, IPatientHealthRecord, IPatientSetupInput } from 'schema';
import { formatPatientHealthRecord } from '../apis/athena/formatters';
import CareTeam from '../models/care-team';
import HomeClinic from '../models/clinic';
import Patient from '../models/patient';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

interface IQuery {
  patientId: string;
}

export async function resolvePatient(
  root: any,
  { patientId }: IQuery,
  { userRole, userId }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  return await Patient.get(patientId);
}

interface IPatientEditOptions {
  input: IPatientEditInput;
}

export async function patientEdit(
  source: any,
  { input }: IPatientEditOptions,
  { userRole, userId }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', input.patientId, userId);

  const filtered = omitBy<{}, IPatientEditInput>(input, isNil);
  return await Patient.edit(filtered, input.patientId);
}

interface IPatientSetupOptions {
  input: IPatientSetupInput;
}

export async function patientSetup(
  source: any,
  { input }: IPatientSetupOptions,
  { athenaApi, userRole, userId }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'create', 'patient');
  if (!userId) {
    throw new Error('no userId: please log in again');
  }

  const result = await Patient.execWithTransaction(async patientWithTransaction => {
    const patient = await patientWithTransaction.setup(input);
    const department = await HomeClinic.get(input.homeClinicId);
    const athenaPatient = await athenaApi.createPatient({
      firstName: input.firstName,
      lastName: input.lastName,
      gender: input.gender,
      zip: input.zip,
      dateOfBirth: input.dateOfBirth,
      departmentId: department.departmentId,
    });

    return await patientWithTransaction.addAthenaPatientId(
      athenaPatient.athenaPatientId,
      patient.id,
    );
  });
  // Need to wait until the transaction is complete to add relations like Care Team
  await CareTeam.addUserToCareTeam({ userId, patientId: result.id });
  return result;
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
