import { transaction } from 'objection';
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
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootQueryType['patientEmails']> {
  return transaction(testTransaction || PatientEmail.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

    logger.log(`GET all emails for patient ${patientId} by ${userId}`);

    return PatientEmail.getAll(patientId, txn);
  });
}
