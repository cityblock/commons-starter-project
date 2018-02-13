import { cloneDeep, isNil, omitBy } from 'lodash';
import {
  IAddressCreateForPatientInput,
  IAddressCreatePrimaryForPatientInput,
  IAddressEditInput,
  IRootMutationType,
} from 'schema';
import Address from '../models/address';
import PatientAddress from '../models/patient-address';
import PatientInfo from '../models/patient-info';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IAddressCreateForPatientOptions {
  input: IAddressCreateForPatientInput;
}

export interface IAddressCreatePrimaryForPatientOptions {
  input: IAddressCreatePrimaryForPatientInput;
}

export async function addressCreateForPatient(
  source: any,
  { input }: IAddressCreateForPatientOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['addressCreateForPatient']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const filtered = omitBy<IAddressCreateForPatientInput>(input, isNil) as any;
  filtered.updatedBy = userId;
  logger.log(`CREATE address for patient ${input.patientId} by ${userId}`, 2);

  const address = await Address.create(filtered, txn);
  await PatientAddress.create({ patientId: input.patientId, addressId: address.id }, txn);
  return address;
}

export async function addressCreatePrimaryForPatient(
  source: any,
  { input }: IAddressCreatePrimaryForPatientOptions,
  context: IContext,
): Promise<IRootMutationType['addressCreatePrimaryForPatient']> {
  const patientInfo = await PatientInfo.get(input.patientInfoId, context.txn);
  await checkUserPermissions(
    context.userId,
    context.permissions,
    'edit',
    'patient',
    context.txn,
    patientInfo.patientId,
  );

  const addressOptions = cloneDeep(input) as any;
  delete addressOptions.patientInfoId;
  addressOptions.patientId = patientInfo.patientId;

  const address = await addressCreateForPatient(
    source,
    {
      input: addressOptions,
    },
    context,
  );
  if (!address) {
    throw new Error('unable to create address');
  }
  await PatientInfo.edit(
    { primaryAddressId: address.id, updatedById: context.userId! },
    input.patientInfoId,
    context.txn,
  );
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
