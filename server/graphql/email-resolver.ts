import { isNil, omitBy } from 'lodash';
import {
  IEmailCreateForPatientInput,
  IEmailCreateInput,
  IEmailDeleteForPatientInput,
  IEmailEditInput,
  IRootMutationType,
} from 'schema';
import Email from '../models/email';
import Patient from '../models/patient';
import PatientEmail from '../models/patient-email';
import PatientInfo from '../models/patient-info';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IEmailCreateForPatientOptions {
  input: IEmailCreateForPatientInput;
}

export async function emailCreateForPatient(
  source: any,
  { input }: IEmailCreateForPatientOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['emailCreateForPatient']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const filtered = omitBy<IEmailCreateForPatientInput>(input, isNil) as any;
  filtered.updatedById = userId;
  logger.log(`CREATE email for patient ${input.patientId} by ${userId}`, 2);

  const email = await Email.create(filtered, txn);
  await PatientEmail.create({ patientId: input.patientId, emailId: email.id }, txn);

  if (input.isPrimary) {
    const patient = await Patient.get(input.patientId, txn);
    await PatientInfo.edit(
      { primaryEmailId: email.id, updatedById: userId! },
      patient.patientInfo.id,
      txn,
    );
  }

  return email;
}

export interface IEmailCreateOptions {
  input: IEmailCreateInput;
}

export async function emailCreate(
  source: any,
  { input }: IEmailCreateOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['emailCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'email', txn);

  const filtered = omitBy<IEmailCreateInput>(input, isNil) as any;
  filtered.updatedById = userId;
  logger.log(`CREATE email by ${userId}`, 2);

  return Email.create(filtered, txn);
}

export interface IEmailDeleteOptions {
  input: IEmailDeleteForPatientInput;
}

export async function emailDeleteForPatient(
  root: any,
  { input }: IEmailDeleteOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<Email> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  logger.log(`DELETE email for patient ${input.patientId} by ${userId}`, 2);

  await PatientEmail.delete({ patientId: input.patientId, emailId: input.emailId }, txn);

  if (input.isPrimary) {
    const patient = await Patient.get(input.patientId, txn);
    await PatientInfo.edit(
      { primaryEmailId: null, updatedById: userId! },
      patient.patientInfo.id,
      txn,
    );
  }

  return Email.delete(input.emailId, txn);
}

export interface IEmailEditOptions {
  input: IEmailEditInput;
}

export async function emailEdit(
  source: any,
  { input }: IEmailEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['emailEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const filtered = omitBy<IEmailEditInput>(input, isNil);
  logger.log(`CREATE email for patient ${input.patientId} by ${userId}`, 2);

  return Email.edit(filtered as any, input.emailId, txn);
}
