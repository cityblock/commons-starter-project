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
  if (!input.patientId) {
    throw new Error('Must provide patient id');
  }

  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const finalConfig = testConfig || config;

  const storage = Storage({
    projectId: finalConfig.GCS_PROJECT_ID,
    credentials: JSON.parse(finalConfig.GCP_CREDS),
  });

  const bucket = storage.bucket(finalConfig.GCS_BUCKET);
  const file = bucket.file(`${input.patientId}/photos/profile_photo.png`);

  const signedUrls = await file.getSignedUrl({
    action: 'write',
    expires: Date.now() + EXPIRE_TIME,
    contentType: 'image/png',
  });

  return { signedUrl: signedUrls[0] };
}
