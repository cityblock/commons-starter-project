import { isNil, omitBy } from 'lodash';
import {
  IPatient,
  IPatientEditInput,
  IPatientHealthRecord,
  IPatientScratchPad,
  IPatientSetupInput,
} from 'schema';
import { IAthenaEditPatient } from '../apis/athena';
import { formatPatientHealthRecord } from '../apis/athena/formatters';
import { getAthenaPatientIdFromCreate } from '../apis/redox/formatters';
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
  { redoxApi, userRole, userId }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'create', 'patient');
  if (!userId) {
    throw new Error('no userId: please log in again');
  }

  const result = await Patient.execWithTransaction(async patientWithTransaction => {
    const patient = await patientWithTransaction.setup(input);
    const department = await HomeClinic.get(input.homeClinicId);
    const redoxPatient = await redoxApi.patientCreate({
      id: patient.id,
      homeClinicId: String(department.departmentId),
      firstName: input.firstName,
      middleName: input.middleName ? input.middleName : undefined,
      lastName: input.lastName,
      gender: input.gender,
      zip: input.zip,
      dateOfBirth: input.dateOfBirth,
      maritalStatus: input.maritalStatus ? input.maritalStatus : undefined,
      race: input.race ? input.race : undefined,
      ssn: input.ssn ? input.ssn : undefined,
      language6392code: input.language6392code ? input.language6392code : undefined,
      email: input.email ? input.email : undefined,
      homePhone: input.homePhone ? input.homePhone : undefined,
      mobilePhone: input.mobilePhone ? input.mobilePhone : undefined,
      ethnicityCode: input.ethnicityCode ? input.ethnicityCode : undefined,
      consentToCall: input.consentToCall ? input.consentToCall : undefined,
      consentToText: input.consentToText ? input.consentToText : undefined,
    });
    const athenaPatientId = getAthenaPatientIdFromCreate(redoxPatient);
    if (!athenaPatientId)  {
      throw new Error('Athena patient was not correctly created');
    }
    return await patientWithTransaction.addAthenaPatientId(
      athenaPatientId,
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

interface IEditPatientRequiredFields {
  patientId: string;
}

interface IPatientHealthRecordEditOptions {
  input: Pick<IEditPatientRequiredFields, 'patientId'> & IAthenaEditPatient;
}

export async function patientHealthRecordEdit(
  root: any,
  { input }: IPatientHealthRecordEditOptions,
  { athenaApi, userRole, userId }: IContext,
): Promise<IPatientHealthRecord> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', input.patientId, userId);

  const athenaPatientId = await Patient.getAthenaPatientId(input.patientId);

  await athenaApi.patientEdit(input, athenaPatientId);
  const patient = await athenaApi.getPatient(athenaPatientId);

  return formatPatientHealthRecord(patient, input.patientId);
}

export async function resolvePatientScratchPad(
  root: any,
  { patientId }: IQuery,
  { userRole, userId }: IContext,
): Promise<IPatientScratchPad> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const patient = await Patient.get(patientId);

  return { text: patient.scratchPad };
}

interface IPatientScratchPadEditOptions {
  input: {
    patientId: string;
    text: string;
  };
}

export async function patientScratchPadEdit(
  root: any,
  { input }: IPatientScratchPadEditOptions,
  { userRole, userId }: IContext,
): Promise<IPatientScratchPad> {
  const { patientId, text } = input;
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', patientId, userId);

  const patient = await Patient.edit({ scratchPad: text }, patientId);

  return { text: patient.scratchPad };
}
