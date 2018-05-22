import { transaction } from 'objection';
import { IRootQueryType } from 'schema';
import ComputedPatientStatus from '../models/computed-patient-status';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export async function resolvePatientComputedPatientStatus(
  root: any,
  args: { patientId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['patientComputedPatientStatus']> {
  return transaction(testTransaction || ComputedPatientStatus.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn);
    const { patientId } = args;

    const computedPatientStatus = await ComputedPatientStatus.getForPatient(patientId, txn);

    /* NOTE: There should really never be a case where there isn't a ComputedPatientStatus for a
     *       patient. We are just being overly defensive here for safety.
     */
    if (!computedPatientStatus) {
      return ComputedPatientStatus.updateForPatient(patientId, userId!, txn);
    }

    return computedPatientStatus;
  });
}
