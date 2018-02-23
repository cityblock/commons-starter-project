import { isNil, omitBy } from 'lodash';
import { IAddressCreateForPatientInput, IAddressEditInput, IRootMutationType } from 'schema';
import Address from '../models/address';
import Patient from '../models/patient';
import PatientAddress from '../models/patient-address';
import PatientInfo from '../models/patient-info';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IAddressCreateForPatientOptions {
  input: IAddressCreateForPatientInput;
}

export async function addressCreateForPatient(
  source: any,
  { input }: IAddressCreateForPatientOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['addressCreateForPatient']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const filtered = omitBy<IAddressCreateForPatientInput>(input, isNil) as any;
  filtered.updatedById = userId;
  logger.log(`CREATE address for patient ${input.patientId} by ${userId}`, 2);

  const address = await Address.create(filtered, txn);
  await PatientAddress.create({ patientId: input.patientId, addressId: address.id }, txn);

  if (input.isPrimary) {
    const patient = await Patient.get(input.patientId, txn);
    await PatientInfo.edit(
      { primaryAddressId: address.id, updatedById: userId! },
      patient.patientInfo.id,
      txn,
    );
  }

  return address;
}

export interface IAddressEditOptions {
  input: IAddressEditInput;
}

export async function addressEdit(
  source: any,
  { input }: IAddressEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['addressEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const filtered = omitBy<IAddressEditInput>(input, isNil);
  logger.log(`CREATE address for patient ${input.patientId} by ${userId}`, 2);

  return Address.edit(filtered as any, input.addressId, txn);
}
