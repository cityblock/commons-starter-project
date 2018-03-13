import { IRootQueryType } from 'schema';
import PatientEmail from '../models/patient-email';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IResolveEmailsOptions {
  patientId: string;
}

export async function resolveEmails(
  source: any,
  { patientId }: IResolveEmailsOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['patientEmails']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET all emails for patient ${patientId} by ${userId}`, 2);

  return PatientEmail.getAll(patientId, txn);
}
