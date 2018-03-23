import { IPatientPhotoSignedUrlCreateInput, IRootMutationType } from 'schema';
import { loadPatientPhotoUrl } from './shared/gcs/helpers';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientPhotoSignedUrlCreateOptions {
  input: IPatientPhotoSignedUrlCreateInput;
}

export async function patientPhotoSignedUrlCreate(
  root: any,
  { input }: IPatientPhotoSignedUrlCreateOptions,
  { permissions, userId, txn, testConfig }: IContext,
): Promise<IRootMutationType['patientPhotoSignedUrlCreate']> {
  const { patientId, action } = input;
  if (!patientId) {
    throw new Error('Must provide patient id');
  }
  const permissionAction = action === 'read' ? 'view' : 'edit';
  await checkUserPermissions(userId, permissions, permissionAction, 'patient', txn, patientId);

  const signedUrl = await loadPatientPhotoUrl(patientId, action, testConfig);

  if (!signedUrl) {
    throw new Error('Something went wrong, please try again.');
  }

  return { signedUrl };
}
