import { isNil, omitBy } from 'lodash';
import { IPhoneCreateForPatientInput, IPhoneEditInput, IRootMutationType } from 'schema';
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

export interface IPhoneEditOptions {
  input: IPhoneEditInput;
}

export async function phoneEdit(
  source: any,
  { input }: IPhoneEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['phoneEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const filtered = omitBy<IPhoneEditInput>(input, isNil);
  logger.log(`CREATE phone for patient ${input.patientId} by ${userId}`, 2);

  return Phone.edit(filtered as any, input.phoneId, txn);
}
