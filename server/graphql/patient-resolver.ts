import { isNil, omitBy } from 'lodash';
import {
  IPatient,
  IPatientEditInput,
  IPatientHealthRecord,
  IPatientScratchPad,
  IPatientSetupInput,
} from 'schema';
import { formatPatientHealthRecord } from '../apis/athena/formatters';
import { getAthenaPatientIdFromCreate } from '../apis/redox/formatters';
import CareTeam from '../models/care-team';
import HomeClinic from '../models/clinic';
import Patient from '../models/patient';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IQuery {
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

export interface IPatientEditOptions {
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

export interface IPatientSetupOptions {
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
      firstName: input.firstName,
      homeClinicId: String(department.departmentId),
      middleName: input.middleName || undefined,
      lastName: input.lastName,
      gender: input.gender,
      zip: input.zip,
      dateOfBirth: input.dateOfBirth,
      maritalStatus: input.maritalStatus,
      race: input.race,
      ssn: input.ssn,
      language: input.language,
      email: input.email || undefined,
      homePhone: input.homePhone || undefined,
      mobilePhone: input.mobilePhone || undefined,
      consentToCall: input.consentToCall,
      consentToText: input.consentToText,
      insuranceType: input.insuranceType || undefined,
      patientRelationshipToPolicyHolder: input.patientRelationshipToPolicyHolder || undefined,
      memberId: input.memberId || undefined,
      policyGroupNumber: input.policyGroupNumber || undefined,
      issueDate: input.issueDate || undefined,
      expirationDate: input.expirationDate || undefined,
    });
    const athenaPatientId = getAthenaPatientIdFromCreate(redoxPatient);
    if (!athenaPatientId) {
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

export interface IEditPatientRequiredFields {
  patientId: string;
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

export interface IPatientScratchPadEditOptions {
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
