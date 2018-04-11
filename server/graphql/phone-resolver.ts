import { isNil, omitBy } from 'lodash';
import {
  IPhoneCreateForPatientInput,
  IPhoneCreateInput,
  IPhoneDeleteForPatientInput,
  IPhoneEditInput,
  IRootMutationType,
} from 'schema';
import Patient from '../models/patient';
import PatientInfo from '../models/patient-info';
import PatientPhone from '../models/patient-phone';
import Phone from '../models/phone';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPhoneCreateForPatientOptions {
  input: IPhoneCreateForPatientInput;
}

export async function phoneCreateForPatient(
  source: any,
  { input }: IPhoneCreateForPatientOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['phoneCreateForPatient']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const filtered = omitBy<IPhoneCreateForPatientInput>(input, isNil) as any;
  filtered.updatedById = userId;
  logger.log(`CREATE phone for patient ${input.patientId} by ${userId}`, 2);

  const phone = await Phone.create(filtered, txn);
  await PatientPhone.create({ patientId: input.patientId, phoneId: phone.id }, txn);

  if (input.isPrimary) {
    const patient = await Patient.get(input.patientId, txn);
    await PatientInfo.edit(
      { primaryPhoneId: phone.id, updatedById: userId! },
      patient.patientInfo.id,
      txn,
    );
  }

  return phone;
}

export interface IPhoneCreateOptions {
  input: IPhoneCreateInput;
}

export async function phoneCreate(
  source: any,
  { input }: IPhoneCreateOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['phoneCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'phone', txn);

  const filtered = omitBy<IPhoneCreateInput>(input, isNil) as any;
  filtered.updatedById = userId;
  logger.log(`CREATE phone by ${userId}`, 2);

  return Phone.create(filtered, txn);
}

export interface IPhoneDeleteOptions {
  input: IPhoneDeleteForPatientInput;
}

export async function phoneDeleteForPatient(
  root: any,
  { input }: IPhoneDeleteOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<Phone> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  logger.log(`DELETE phone for patient ${input.patientId} by ${userId}`, 2);

  await PatientPhone.delete({ patientId: input.patientId, phoneId: input.phoneId }, txn);

  if (input.isPrimary) {
    const patient = await Patient.get(input.patientId, txn);
    await PatientInfo.edit(
      { primaryPhoneId: null, updatedById: userId! },
      patient.patientInfo.id,
      txn,
    );
  }

  return Phone.delete(input.phoneId, txn);
}

export interface IPhoneEditOptions {
  input: IPhoneEditInput;
}

export async function phoneEdit(
  source: any,
  { input }: IPhoneEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['phoneEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  // const filtered = omitBy<IPhoneEditInput>(input, isNil);
  logger.log(`CREATE phone for patient ${input.patientId} by ${userId}`, 2);
  // TODO: fix this to create a new phone
  // return Phone.edit(filtered as any, input.phoneId, txn);
  return Phone.get(input.phoneId, txn);
}
