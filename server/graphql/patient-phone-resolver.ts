import { IRootQueryType } from 'schema';
import PatientPhone from '../models/patient-phone';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IResolvePhonesOptions {
  patientId: string;
}

export async function resolvePhones(
  source: any,
  { patientId }: IResolvePhonesOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['patientPhones']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET all phones for patient ${patientId} by ${userId}`, 2);

  return PatientPhone.getAll(patientId, txn);
}
