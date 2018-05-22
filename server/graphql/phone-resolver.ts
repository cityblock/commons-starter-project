import { isNil, omitBy } from 'lodash';
import { transaction } from 'objection';
import {
  IPhoneCreateForPatientInput,
  IPhoneCreateInput,
  IPhoneDeleteForPatientInput,
  IRootMutationType,
} from 'schema';
import { addJobToQueue } from '../helpers/queue-helpers';
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
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootMutationType['phoneCreateForPatient']> {
  return transaction(testTransaction || Phone.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

    const filtered = omitBy<IPhoneCreateForPatientInput>(input, isNil) as any;
    filtered.updatedById = userId;
    logger.log(`CREATE phone for patient ${input.patientId} by ${userId}`);

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

    addJobToQueue('patientContactEdit', {
      patientId: input.patientId,
      type: 'addPhoneNumber',
    });

    return phone;
  });
}

export interface IPhoneCreateOptions {
  input: IPhoneCreateInput;
}

export async function phoneCreate(
  source: any,
  { input }: IPhoneCreateOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootMutationType['phoneCreate']> {
  return transaction(testTransaction || Phone.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'phone', txn);

    const filtered = omitBy<IPhoneCreateInput>(input, isNil) as any;
    filtered.updatedById = userId;
    logger.log(`CREATE phone by ${userId}`);

    return Phone.create(filtered, txn);
  });
}

export interface IPhoneDeleteOptions {
  input: IPhoneDeleteForPatientInput;
}

export async function phoneDeleteForPatient(
  root: any,
  { input }: IPhoneDeleteOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<Phone> {
  return transaction(testTransaction || Phone.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

    logger.log(`DELETE phone for patient ${input.patientId} by ${userId}`);

    await PatientPhone.delete({ patientId: input.patientId, phoneId: input.phoneId }, txn);

    if (input.isPrimary) {
      const patient = await Patient.get(input.patientId, txn);
      await PatientInfo.edit(
        { primaryPhoneId: null, updatedById: userId! },
        patient.patientInfo.id,
        txn,
      );
    }

    addJobToQueue('patientContactEdit', {
      patientId: input.patientId,
      type: 'deletePhoneNumber',
    });

    return Phone.delete(input.phoneId, txn);
  });
}
