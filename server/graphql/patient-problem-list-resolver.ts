import { IRootQueryType } from 'schema';
import { loadPatientDiagnoses } from './shared/gcs/helpers';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export async function resolvePatientProblemList(
  root: any,
  args: { patientId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientProblemList']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return loadPatientDiagnoses(args.patientId);
}
