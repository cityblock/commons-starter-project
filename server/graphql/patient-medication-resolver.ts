import { IRootQueryType } from 'schema';
import { loadPatientMedications } from './shared/gcs/helpers';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export async function resolvePatientMedications(
  root: any,
  args: { patientId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientMedications']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return loadPatientMedications(args.patientId);
}
