import { transaction } from 'objection';
import { IRootQueryType } from 'schema';
import Patient from '../models/patient';
import { loadPatientDiagnoses } from './shared/gcs/helpers';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export async function resolvePatientProblemList(
  root: any,
  args: { patientId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['patientProblemList']> {
  return transaction(testTransaction || Patient.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

    return loadPatientDiagnoses(args.patientId);
  });
}
