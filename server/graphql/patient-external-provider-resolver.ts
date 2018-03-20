import { isNil, isNull, omitBy } from 'lodash';
import { Transaction } from 'objection';
import {
  IEmailCreateInput,
  IEmailInput,
  IPatientExternalProviderCreateInput,
  IPatientExternalProviderDeleteInput,
  IPatientExternalProviderEditInput,
  IPhoneCreateInput,
  IPhoneInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import ComputedPatientStatus from '../models/computed-patient-status';
import Email from '../models/email';
import PatientExternalProvider from '../models/patient-external-provider';
import PatientExternalProviderEmail from '../models/patient-external-provider-email';
import PatientExternalProviderPhone from '../models/patient-external-provider-phone';
import Phone from '../models/phone';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientExternalProviderCreateOptions {
  input: IPatientExternalProviderCreateInput;
}

export interface IPatientExternalProviderEditOptions {
  input: IPatientExternalProviderEditInput;
}

export interface IPatientExternalProviderDeleteOptions {
  input: IPatientExternalProviderDeleteInput;
}

export interface IQuery {
  patientId: string;
}

export async function resolvePatientExternalProvidersForPatient(
  source: any,
  { patientId }: IQuery,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['patientExternalProviders']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET patient external providers for ${patientId} by ${userId}`, 2);
  return PatientExternalProvider.getAllForPatient(patientId, txn);
}

export async function patientExternalProviderDelete(
  source: any,
  { input }: IPatientExternalProviderDeleteOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientExternalProviderDelete']> {
  const patientExternalProvider = await PatientExternalProvider.get(
    input.patientExternalProviderId,
    txn,
  );

  await checkUserPermissions(
    userId,
    permissions,
    'edit',
    'patient',
    txn,
    patientExternalProvider.patientId,
  );
  logger.log(`DELETE patient contact ${input.patientExternalProviderId} by ${userId}`, 2);
  const { id, email, phone } = patientExternalProvider;
  const promises: Array<Promise<any>> = [];

  if (email) {
    await PatientExternalProviderEmail.delete(
      { emailId: email.id, patientExternalProviderId: id },
      txn,
    );
    promises.push(Email.delete(email.id, txn));
  }
  if (phone) {
    await PatientExternalProviderPhone.delete(
      { phoneId: phone.id, patientExternalProviderId: id },
      txn,
    );
    promises.push(Phone.delete(phone.id, txn));
  }

  await Promise.all(promises);
  const deletedPatientExternalProvider = await PatientExternalProvider.delete(id, userId!, txn);
  await ComputedPatientStatus.updateForPatient(patientExternalProvider.patientId, userId!, txn);
  return deletedPatientExternalProvider;
}

export async function patientExternalProviderCreate(
  source: any,
  { input }: IPatientExternalProviderCreateOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientExternalProviderCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'patient', txn, input.patientId);

  const filtered = omitBy<IPatientExternalProviderCreateInput>(input, isNil) as any;
  delete filtered.phone;
  delete filtered.email;

  logger.log(`CREATE patient contact for patient ${input.patientId} by ${userId}`, 2);
  const patientExternalProvider = await PatientExternalProvider.create(
    { ...filtered, updatedById: userId! },
    txn,
  );

  const promises = [
    createEmail(patientExternalProvider.id, userId!, input.email, txn),
    createPhone(patientExternalProvider.id, userId!, input.phone, txn),
  ];

  await Promise.all(promises);
  await ComputedPatientStatus.updateForPatient(input.patientId, userId!, txn);
  return PatientExternalProvider.get(patientExternalProvider.id, txn);
}

export async function patientExternalProviderEdit(
  source: any,
  { input }: IPatientExternalProviderEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientExternalProviderEdit']> {
  const patientExternalProvider = await PatientExternalProvider.get(
    input.patientExternalProviderId,
    txn,
  );

  await checkUserPermissions(
    userId,
    permissions,
    'edit',
    'patient',
    txn,
    patientExternalProvider.patientId,
  );
  logger.log(`EDIT patient contact ${input.patientExternalProviderId} by ${userId}`, 2);

  const promises = [
    updateEmail(patientExternalProvider.id, userId!, input.email, txn),
    updatePhone(patientExternalProvider.id, userId!, input.phone, txn),
  ] as Array<Promise<any>>;

  await Promise.all(promises);
  const filtered = omitBy(input, isNil);
  delete filtered.phone;
  delete filtered.email;

  const updatedPatientExternalProvider = await PatientExternalProvider.edit(
    { ...(filtered as any), updatedById: userId },
    input.patientExternalProviderId,
    txn,
  );

  await ComputedPatientStatus.updateForPatient(patientExternalProvider.patientId, userId!, txn);

  return updatedPatientExternalProvider;
}

async function createEmail(
  patientExternalProviderId: string,
  userId: string,
  emailInput: IEmailCreateInput | null | undefined,
  txn: Transaction,
) {
  if (emailInput) {
    const filteredInput = omitBy<IEmailCreateInput>(emailInput, input => !input) as any;

    if (Object.keys(filteredInput).length) {
      const email = await Email.create({ ...filteredInput, updatedById: userId }, txn);
      PatientExternalProviderEmail.create({ patientExternalProviderId, emailId: email.id }, txn);
    }
  }
}

async function createPhone(
  patientExternalProviderId: string,
  userId: string,
  phoneInput: IPhoneCreateInput | null,
  txn: Transaction,
) {
  if (phoneInput) {
    const filteredInput = omitBy<IPhoneCreateInput>(phoneInput, input => !input) as any;

    if (Object.keys(filteredInput).length) {
      const phone = await Phone.create({ ...filteredInput, updatedById: userId }, txn);
      PatientExternalProviderPhone.create({ patientExternalProviderId, phoneId: phone.id }, txn);
    }
  }
}

async function updateEmail(
  patientExternalProviderId: string,
  userId: string,
  emailInput: IEmailCreateInput | null | undefined,
  txn: Transaction,
) {
  if (!emailInput) {
    return;
  }

  const emails = await PatientExternalProviderEmail.getForPatientExternalProvider(
    patientExternalProviderId,
    txn,
  );

  // if no email currently exists for this patient contact
  if (!emails.length) {
    return createEmail(patientExternalProviderId, userId, emailInput, txn);
  }

  const currentEmail = emails[0];

  // delete if the email exists and the email input is all empty
  const shouldDelete = !Object.keys(omitBy(emailInput, input => !input)).length;
  if (shouldDelete) {
    await PatientExternalProviderEmail.delete(
      { emailId: currentEmail.id, patientExternalProviderId },
      txn,
    );
    return Email.delete(currentEmail.id, txn);
  }

  // edit existing patient contact email
  const filteredInput = omitBy<IEmailInput>(emailInput, isNull) as any;
  return Email.edit({ ...filteredInput, updatedById: userId }, currentEmail.id, txn);
}

async function updatePhone(
  patientExternalProviderId: string,
  userId: string,
  phoneInput: IPhoneInput | null | undefined,
  txn: Transaction,
) {
  if (!phoneInput) {
    return;
  }

  const phones = await PatientExternalProviderPhone.getForPatientExternalProvider(
    patientExternalProviderId,
    txn,
  );
  if (!phones.length) {
    throw new Error('patient contact phone not found');
  }

  const currentPhone = phones[0];

  // edit existing patient contact phone
  const filteredInput = omitBy<IPhoneInput>(phoneInput, isNull) as any;
  return Phone.edit({ ...filteredInput, updatedById: userId }, currentPhone.id, txn);
}
/* tslint:enable check-is-allowed */
