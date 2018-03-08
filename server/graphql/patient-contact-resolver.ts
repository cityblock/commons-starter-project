import { isNil, omitBy } from 'lodash';
import {
  IPatientContactCreateInput,
  IPatientContactEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import PatientContact from '../models/patient-contact';
import PatientContactAddress from '../models/patient-contact-address';
import PatientContactEmail from '../models/patient-contact-email';
import PatientContactPhone from '../models/patient-contact-phone';
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

export async function patientContactCreate(
  source: any,
  { input }: IPatientContactCreateOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientContactCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'patient', txn, input.patientId);

  const filtered = omitBy<IPatientContactCreateInput>(input, isNil) as any;
  (filtered.updatedById = userId),
    logger.log(`CREATE patient contact for patient ${input.patientId} by ${userId}`, 2);

  const patientContact = await PatientContact.create(filtered, txn);

  const promises = [] as Array<Promise<any>>;
  if (filtered.primaryAddressId) {
    promises.push(
      PatientContactAddress.create(
        { patientContactId: patientContact.id, addressId: filtered.primaryAddressId },
        txn,
      ),
    );
  }
  if (filtered.primaryEmailId) {
    promises.push(
      PatientContactEmail.create(
        { patientContactId: patientContact.id, emailId: filtered.primaryEmailId },
        txn,
      ),
    );
  }
  if (filtered.primaryPhoneId) {
    promises.push(
      PatientContactPhone.create(
        { patientContactId: patientContact.id, phoneId: filtered.primaryPhoneId },
        txn,
      ),
    );
  }

  await Promise.all(promises);
  return patientContact;
}

export async function patientContactEdit(
  source: any,
  { input }: IPatientContactEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientContactEdit']> {
  const patientContact = await PatientContact.get(input.patientContactId, txn);

  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientContact.patientId);

  const filtered = omitBy<IPatientContactEditInput>(input, isNil);
  logger.log(`EDIT patient contact ${input.patientContactId} by ${userId}`, 2);

  const promises = [] as Array<Promise<any>>;
  if (filtered.primaryAddressId) {
    promises.push(
      PatientContactAddress.create(
        { patientContactId: patientContact.id, addressId: filtered.primaryAddressId },
        txn,
      ),
    );
  }
  if (filtered.primaryEmailId) {
    promises.push(
      PatientContactEmail.create(
        { patientContactId: patientContact.id, emailId: filtered.primaryEmailId },
        txn,
      ),
    );
  }

  await Promise.all(promises);
  return PatientContact.edit(
    { ...(filtered as any), updatedById: userId },
    input.patientContactId,
    txn,
  );
}
/* tslint:enable check-is-allowed */
