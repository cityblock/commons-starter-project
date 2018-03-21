import * as Storage from '@google-cloud/storage';
import { IPatientPhotoSignedUrlCreateInput, IRootMutationType } from 'schema';
import config from '../config';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

const EXPIRE_TIME = 1000 * 60 * 5; // 5 minutes

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

  const finalConfig = testConfig || config;

  const storage = Storage({
    projectId: finalConfig.GCS_PROJECT_ID,
    credentials: JSON.parse(finalConfig.GCP_CREDS),
  });

  const bucket = storage.bucket(finalConfig.GCS_BUCKET);
  const file = bucket.file(`${patientId}/photos/profile_photo.png`);

  const signedUrlParams: Storage.SignedUrlConfig = {
    action,
    expires: Date.now() + EXPIRE_TIME,
  };

  if (action === 'write') {
    signedUrlParams.contentType = 'image/png';
  }

  const signedUrls = await file.getSignedUrl(signedUrlParams);

  return { signedUrl: signedUrls[0] };
}
