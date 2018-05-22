import { transaction } from 'objection';
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
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootQueryType['patientPhones']> {
  return transaction(testTransaction || PatientPhone.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

    logger.log(`GET all phones for patient ${patientId} by ${userId}`);

    return PatientPhone.getAll(patientId, txn);
  });
}
