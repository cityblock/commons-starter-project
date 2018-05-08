import * as Storage from '@google-cloud/storage';
import * as crypto from 'crypto';
import { isEmpty } from 'lodash';
import {
  IPatientDiagnosis,
  IPatientEncounter,
  IPatientMedication,
  PatientSignedUrlAction,
  UserSignedUrlAction,
} from 'schema';
import config from '../../../config';
import { mockGoogleCredentials } from '../../../spec-helpers';

const EXPIRE_TIME = 1000 * 60 * 5; // 5 minutes

export const loadPatientPhotoUrl = async (
  patientId: string,
  action: PatientSignedUrlAction,
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
  action: PatientSignedUrlAction,
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

export const loadPatientAggregatedDataFile = async (
  patientId: string,
  aggregatedDataType: 'medications' | 'diagnoses' | 'encounters',
  testConfig?: any,
): Promise<string | null> => {
  let finalConfig: any = config;
  if (config.NODE_ENV === 'test') {
    finalConfig = mockGoogleCredentials();
  }

  const storage = Storage({
    credentials: JSON.parse(finalConfig.GCP_CREDS || ''),
  });
  const bucket = storage.bucket(finalConfig.GCS_BUCKET || '');
  const file = bucket.file(`${patientId}/aggregated_data/${aggregatedDataType}.json`);

  let fileContents: string | null;
  try {
    const downloadedFile = await file.download();
    fileContents = downloadedFile[0].toString();
  } catch (err) {
    fileContents = null;
  }

  return fileContents;
};

export const parsePatientAggregatedDataFile = async (
  dataFileContents: string | null,
): Promise<any[]> => {
  if (dataFileContents) {
    try {
      return JSON.parse(dataFileContents);
    } catch (err) {
      // TODO: Maybe report an error to Stackdriver?
      return [];
    }
  } else {
    // TODO: Maybe report an error to Stackdriver?
    return [];
  }
};

export const loadPatientDiagnoses = async (patientId: string): Promise<IPatientDiagnosis[]> => {
  const rawPatientDiagnoses = await loadPatientAggregatedDataFile(patientId, 'diagnoses');
  const patientDiagnoses = await parsePatientAggregatedDataFile(rawPatientDiagnoses);

  return patientDiagnoses
    .map(patientDiagnosis => {
      const id = crypto
        .createHash('md5')
        .update(JSON.stringify(patientDiagnosis))
        .digest('hex');

      const diagnosisData = patientDiagnosis.problem;

      return {
        id,
        name: diagnosisData.Name,
        code: diagnosisData.Code,
        startDate: diagnosisData.StartDate,
        endDate: diagnosisData.EndDate,
      };
    })
    .filter(patientDiagnosis => isEmpty(patientDiagnosis.endDate));
};

export const loadPatientMedications = async (patientId: string): Promise<IPatientMedication[]> => {
  const rawPatientMedications = await loadPatientAggregatedDataFile(patientId, 'medications');
  const patientMedications = await parsePatientAggregatedDataFile(rawPatientMedications);

  return patientMedications.map(patientMedication => {
    const id = crypto
      .createHash('md5')
      .update(JSON.stringify(patientMedication))
      .digest('hex');

    const medicationData = patientMedication.medication;

    return {
      id,
      name: medicationData.Product.Name,
      dosage: `${medicationData.Dose.Quantity}${medicationData.Dose.Units}`,
      startDate: medicationData.StartDate,
      endDate: medicationData.EndDate,
    };
  });
};

export const loadPatientEncounters = async (patientId: string): Promise<IPatientEncounter[]> => {
  const rawPatientEncounters = await loadPatientAggregatedDataFile(patientId, 'encounters');
  const patientEncounters = await parsePatientAggregatedDataFile(rawPatientEncounters);

  // TODO: Remove this once we no longer need to stub out front end for demo purposes
  if (!patientEncounters.length) {
    return [
      {
        id: 'patient-encounter-id',
        location: 'ACPNY - Radiology',
        source: 'Claims',
        date: '2018-04-05T15:45:20.256Z',
        title: 'Ultrasound Kidney Stones',
        notes: 'This is a note about this encounter.',
        progressNoteId: null,
      },
    ];
  }

  return (patientEncounters as IPatientEncounter[]).map(patientEncounter => {
    const id = crypto
      .createHash('md5')
      .update(JSON.stringify(patientEncounter))
      .digest('hex');

    return { ...patientEncounter, id, progressNoteId: null };
  });
};

export const loadUserVoicemailUrl = async (
  userId: string,
  voicemailId: string,
  action: UserSignedUrlAction,
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
