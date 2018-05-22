import { transaction } from 'objection';
import { IPatientPhotoSignedUrlCreateInput, IRootMutationType } from 'schema';
import Patient from '../models/patient';
import { loadPatientPhotoUrl } from './shared/gcs/helpers';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientPhotoSignedUrlCreateOptions {
  input: IPatientPhotoSignedUrlCreateInput;
}

export async function patientPhotoSignedUrlCreate(
  root: any,
  { input }: IPatientPhotoSignedUrlCreateOptions,
  { permissions, userId, testTransaction, testConfig }: IContext,
): Promise<IRootMutationType['patientPhotoSignedUrlCreate']> {
  const { patientId, action } = input;
  if (!patientId) {
    throw new Error('Must provide patient id');
  }
  return transaction(testTransaction || Patient.knex(), async txn => {
    const permissionAction = action === 'read' ? 'view' : 'edit';
    await checkUserPermissions(userId, permissions, permissionAction, 'patient', txn, patientId);

    const signedUrl = await loadPatientPhotoUrl(patientId, action, testConfig);

    if (!signedUrl) {
      throw new Error('Something went wrong, please try again.');
    }

    return { signedUrl };
  });
}
