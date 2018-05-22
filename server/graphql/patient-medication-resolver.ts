import { transaction } from 'objection';
import { IRootQueryType } from 'schema';
import Patient from '../models/patient';
import { loadPatientMedications } from './shared/gcs/helpers';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export async function resolvePatientMedications(
  root: any,
  args: { patientId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['patientMedications']> {
  return transaction(testTransaction || Patient.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

    return loadPatientMedications(args.patientId);
  });
}
