import { IRootQueryType } from 'schema';
import PatientAddress from '../models/patient-address';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IResolveAddressesOptions {
  patientId: string;
}

export async function resolveAddresses(
  source: any,
  { patientId }: IResolveAddressesOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['patientAddresses']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET all addresses for patient ${patientId} by ${userId}`);

  return PatientAddress.getAll(patientId, txn);
}
