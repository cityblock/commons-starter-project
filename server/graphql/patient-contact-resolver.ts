import { isNil, isNull, omitBy } from 'lodash';
import { Transaction } from 'objection';
import {
  IAddressCreateInput,
  IAddressInput,
  IEmailCreateInput,
  IEmailInput,
  IPatientContactCreateInput,
  IPatientContactEditInput,
  IPhoneCreateInput,
  IPhoneInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import Address from '../models/address';
import ComputedPatientStatus from '../models/computed-patient-status';
import Email from '../models/email';
import PatientContact from '../models/patient-contact';
import PatientContactAddress from '../models/patient-contact-address';
import PatientContactEmail from '../models/patient-contact-email';
import PatientContactPhone from '../models/patient-contact-phone';
import Phone from '../models/phone';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientContactCreateOptions {
  input: IPatientContactCreateInput;
}

export interface IPatientContactEditOptions {
  input: IPatientContactEditInput;
}

export interface IQuery {
  patientId: string;
}

export async function resolveHealthcareProxiesForPatient(
  source: any,
  { patientId }: IQuery,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['patientContactHealthcareProxies']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET patient contact healthcare proxies for ${patientId} by ${userId}`, 2);
  return PatientContact.getHealthcareProxiesForPatient(patientId, txn);
}

export async function resolvePatientContactsForPatient(
  source: any,
  { patientId }: IQuery,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['patientContacts']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET patient contacts for ${patientId} by ${userId}`, 2);
  return PatientContact.getAllForPatient(patientId, txn);
}

export async function patientContactCreate(
  source: any,
  { input }: IPatientContactCreateOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientContactCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'patient', txn, input.patientId);

  const filtered = omitBy<IPatientContactCreateInput>(input, isNil) as any;
  delete filtered.phone;
  delete filtered.address;
  delete filtered.email;

  logger.log(`CREATE patient contact for patient ${input.patientId} by ${userId}`, 2);
  const patientContact = await PatientContact.create({ ...filtered, updatedById: userId! }, txn);

  const promises = [
    createAddress(patientContact.id, userId!, input.address, txn),
    createEmail(patientContact.id, userId!, input.email, txn),
    createPhone(patientContact.id, userId!, input.phone, txn),
  ];

  await Promise.all(promises);
  await ComputedPatientStatus.updateForPatient(input.patientId, userId!, txn);
  return PatientContact.get(patientContact.id, txn);
}

export async function patientContactEdit(
  source: any,
  { input }: IPatientContactEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientContactEdit']> {
  const patientContact = await PatientContact.get(input.patientContactId, txn);

  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientContact.patientId);
  logger.log(`EDIT patient contact ${input.patientContactId} by ${userId}`, 2);

  const promises = [
    updateAddress(patientContact.id, userId!, input.address, txn),
    updateEmail(patientContact.id, userId!, input.email, txn),
    updatePhone(patientContact.id, userId!, input.phone, txn),
  ] as Array<Promise<any>>;

  await Promise.all(promises);
  const filtered = omitBy(input, isNil);
  delete filtered.phone;
  delete filtered.address;
  delete filtered.email;

  const updatedPatientContact = await PatientContact.edit(
    { ...(filtered as any), updatedById: userId },
    input.patientContactId,
    txn,
  );

  await ComputedPatientStatus.updateForPatient(patientContact.patientId, userId!, txn);

  return updatedPatientContact;
}

async function createAddress(
  patientContactId: string,
  userId: string,
  addressInput: IAddressCreateInput | null | undefined,
  txn: Transaction,
) {
  if (addressInput) {
    const filteredInput = omitBy<IAddressCreateInput>(addressInput, input => !input) as any;

    if (Object.keys(filteredInput).length) {
      const address = await Address.create({ ...filteredInput, updatedById: userId }, txn);
      PatientContactAddress.create({ patientContactId, addressId: address.id }, txn);
    }
  }
}

async function createEmail(
  patientContactId: string,
  userId: string,
  emailInput: IEmailCreateInput | null | undefined,
  txn: Transaction,
) {
  if (emailInput) {
    const filteredInput = omitBy<IEmailCreateInput>(emailInput, input => !input) as any;

    if (Object.keys(filteredInput).length) {
      const email = await Email.create({ ...filteredInput, updatedById: userId }, txn);
      PatientContactEmail.create({ patientContactId, emailId: email.id }, txn);
    }
  }
}

async function createPhone(
  patientContactId: string,
  userId: string,
  phoneInput: IPhoneCreateInput | null,
  txn: Transaction,
) {
  if (phoneInput) {
    const filteredInput = omitBy<IPhoneCreateInput>(phoneInput, input => !input) as any;

    if (Object.keys(filteredInput).length) {
      const phone = await Phone.create({ ...filteredInput, updatedById: userId }, txn);
      PatientContactPhone.create({ patientContactId, phoneId: phone.id }, txn);
    }
  }
}

async function updateAddress(
  patientContactId: string,
  userId: string,
  addressInput: IAddressInput | null | undefined,
  txn: Transaction,
) {
  if (!addressInput) {
    return;
  }

  const addresses = await PatientContactAddress.getForPatientContact(patientContactId, txn);

  // if no address currently exists for this patient contact
  if (!addresses.length) {
    return createAddress(patientContactId, userId, addressInput, txn);
  }

  const currentAddress = addresses[0];

  // delete if the address exists and the address input is all empty
  const shouldDelete = !Object.keys(omitBy(addressInput, input => !input)).length;
  if (shouldDelete) {
    await PatientContactAddress.delete({ addressId: currentAddress.id, patientContactId }, txn);
    return Address.delete(currentAddress.id, txn);
  }

  // edit existing patient contact address
  const filteredInput = omitBy<IAddressInput>(addressInput, isNull) as any;
  return Address.edit({ ...filteredInput, updatedById: userId }, currentAddress.id, txn);
}

async function updateEmail(
  patientContactId: string,
  userId: string,
  emailInput: IEmailCreateInput | null | undefined,
  txn: Transaction,
) {
  if (!emailInput) {
    return;
  }

  const emails = await PatientContactEmail.getForPatientContact(patientContactId, txn);

  // if no email currently exists for this patient contact
  if (!emails.length) {
    return createEmail(patientContactId, userId, emailInput, txn);
  }

  const currentEmail = emails[0];

  // delete if the email exists and the email input is all empty
  const shouldDelete = !Object.keys(omitBy(emailInput, input => !input)).length;
  if (shouldDelete) {
    await PatientContactEmail.delete({ emailId: currentEmail.id, patientContactId }, txn);
    return Email.delete(currentEmail.id, txn);
  }

  // edit existing patient contact email
  const filteredInput = omitBy<IEmailInput>(emailInput, isNull) as any;
  return Email.edit({ ...filteredInput, updatedById: userId }, currentEmail.id, txn);
}

async function updatePhone(
  patientContactId: string,
  userId: string,
  phoneInput: IPhoneInput | null | undefined,
  txn: Transaction,
) {
  if (!phoneInput) {
    return;
  }

  const phones = await PatientContactPhone.getForPatientContact(patientContactId, txn);
  if (!phones.length) {
    throw new Error('patient contact phone not found');
  }

  const currentPhone = phones[0];

  // edit existing patient contact phone
  const filteredInput = omitBy<IPhoneInput>(phoneInput, isNull) as any;
  return Phone.edit({ ...filteredInput, updatedById: userId }, currentPhone.id, txn);
}
/* tslint:enable check-is-allowed */
