import * as Storage from '@google-cloud/storage';
import { IPatientSignedUrlActionEnum, IUserSignedUrlActionEnum } from 'schema';
import config from '../../../config';

const EXPIRE_TIME = 1000 * 60 * 5; // 5 minutes

export const loadPatientPhotoUrl = async (
  patientId: string,
  action: IPatientSignedUrlActionEnum,
  testConfig?: any,
): Promise<string | null> => {
  if (!patientId) return null;

  const finalConfig = testConfig || config;

  const storage = Storage({
    projectId: finalConfig.GCS_PROJECT_ID || '',
    credentials: JSON.parse(finalConfig.GCP_CREDS || ''),
  });

  const bucket = storage.bucket(finalConfig.GCS_PATIENT_BUCKET || '');
  const file = bucket.file(`${patientId}/photos/profile_photo.png`);

  const signedUrlParams: Storage.SignedUrlConfig = {
    action,
    expires: Date.now() + EXPIRE_TIME,
  };

  if (action === 'write') {
    signedUrlParams.contentType = 'image/png';
  }

  const signedUrls = await file.getSignedUrl(signedUrlParams);

  return signedUrls && signedUrls[0] ? signedUrls[0] : null;
};

export const loadPatientDocumentUrl = async (
  patientId: string,
  action: IPatientSignedUrlActionEnum,
  filename: string,
  contentType?: string | null,
  testConfig?: any,
): Promise<string | null> => {
  if (!patientId) return null;

  const finalConfig = testConfig || config;

  const storage = Storage({
    projectId: finalConfig.GCS_PROJECT_ID || '',
    credentials: JSON.parse(finalConfig.GCP_CREDS || ''),
  });

  const bucket = storage.bucket(finalConfig.GCS_PATIENT_BUCKET || '');
  const file = bucket.file(`${patientId}/documents/${filename}`);

  const signedUrlParams: Storage.SignedUrlConfig = {
    action,
    expires: Date.now() + EXPIRE_TIME,
  };

  if (action === 'write' && contentType) {
    signedUrlParams.contentType = contentType;
  }

  const signedUrls = await file.getSignedUrl(signedUrlParams);

  return signedUrls && signedUrls[0] ? signedUrls[0] : null;
};

export const loadUserVoicemailUrl = async (
  userId: string,
  voicemailId: string,
  action: IUserSignedUrlActionEnum,
  testConfig?: any,
): Promise<string | null> => {
  if (!userId || !voicemailId) return null;

  const finalConfig = testConfig || config;

  const storage = Storage({
    projectId: finalConfig.GCS_PROJECT_ID || '',
    credentials: JSON.parse(finalConfig.GCP_CREDS || ''),
  });

  const bucket = storage.bucket(finalConfig.GCS_USER_BUCKET || '');
  const file = bucket.file(`${userId}/voicemails/${voicemailId}.mp3`);

  const signedUrlParams: Storage.SignedUrlConfig = {
    action,
    expires: Date.now() + EXPIRE_TIME,
  };

  if (action === 'write') {
    signedUrlParams.contentType = 'audio/mpeg';
  }

  const signedUrls = await file.getSignedUrl(signedUrlParams);

  return signedUrls && signedUrls[0] ? signedUrls[0] : null;
};
