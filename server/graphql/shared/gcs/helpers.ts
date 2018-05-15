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
  aggregatedDataType: 'medications' | 'diagnoses' | 'encounters' | 'claims-encounters',
): Promise<string | null> => {
  let finalConfig: any = config;
  if (config.NODE_ENV === 'test') {
    finalConfig = {
      GCP_CREDS:
        '{"private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyxrqMnMzxS81l\\n0fbRMDgg2je3wDLBOg96cSnIcb4cq2mmKQwYUQyzSikcVhBF4OwJOuybntOtxlyG\\nDz9f66rW8G4hKdcz0m7Og6fcMP25BT4plVOMNPZPjFu66RJE1ZNqiv6uzZXEgOAn\\na2xlXg+o0ejaqvpxe/meNad4cLjsjM2/pOqy9Pk2sBp3yFggyO1tECVFnitik+Oq\\nRm45796fCmUh8GcvPiJUg+x/u0Url0VZzVBwhiQtdEUYx/tUSWxVggNJGPUcUER2\\nFm+xcfeN5GhaxS5+ZTTZyEWhZJQxeASE17jBl8c7XkDqMQlwotK0GS/hhLluFJvP\\nBAF5B4+dAgMBAAECggEAEcRAK9M1ZtGCsxi/r6BcI5+sI9287YkImsF+RoZPP2gl\\nkrbHle8QFQ1Msp029srYij5J31lUbhOlhEklojG4g63XNAKFeYfzLSDWYMKZpHaJ\\n6/YEHI3y4IrxXszk3ORgxxjTIKobtTCdli1N03Eam0tpGboeM4L/lqJ8ZzLEnfVh\\nXr9A47wgJpB4CZh1ipjmqDQJQ8Ej3JygaXErT04J0mmGs9ZO2M/ijl2PubqibcQs\\njt2MKGMcwVTXxjqES5tjUYKzYpl9IW2528SRUiYH5egQiEr7EUd4m2dWouiQ4UEj\\nJGCbrrOySzMLFcLD7XwuLyze6kkz121MM4vSG8rS4QKBgQD1HvHBuYN4eUd08gkb\\npDZs4zFBjI8okNkZfsvr/o8GFHdm+5in60dXda13ZtrzYT+Bl+ck/jarEZlWgqV6\\nEcti6i58xVP7FLc3bAZg0BMrYAEDYlVeuFZex99nbaawUlY6JyPQppgCX6AY1EhD\\nnfgS1yXl5Ziiom1ASQEiulU7hQKBgQC6tfqsBWRM8l5xUlCz0UJi7+G9kKLbIUQL\\nnJQRP3PTX9/KzUZi5EOzKLp3zEEz3N8fLn9YI9hUu7qAGC/ZLrHORIfOeOL6Tt2C\\nvcrWNlYHzxVp6LG2r6vyYA1XpeDheyMIXuRKPYjAJU91ru70vpPOyQ8xVUKYt2fa\\nhv40zQvDOQKBgE6yhanN1tDqFzALuTLfsP2an6jM6PV8M8eEtxHoo6CvF3q/0k4v\\nMrN4u523LxquoUYJMBPnbkPUHafxwBEF/4edahly/TiCeSRZEV8pzs3BP/IHMyN7\\nCXfasfYx9S9s7/QxtsT5h5pTe0Idfan/4LKj0q4R3cRxY6QdDDlLG6xFAoGAPueQ\\nzOQEJuiBaSyShAK8mxi2tWdFdw5+Hmtid20pWM20WF9Ql4DQTkwqhrIKRa7kfVzt\\nCoUJHYMiEoYTmNhij1wHZUjVL//iIWpQLFuiIH9kd4ouVZ5aEA7Mb/szCMSzyN4v\\ni9Ovfw0S+FM3rr2GjuSuebB//3PLSZSxkJiEngECgYEA416H0a457vjnN6mzTktD\\nXI3Na36Q/VdXmMR5f9GXagpsBIO101XM7U3YY36jD7GzQaOQpZvwiZKy0jVLfx8B\\nXb1Ugj9ljqyWt9K0Fni+LrsvkV2pPURokdT3j+DfcnOklUMAPQzzZZ2FfkFX80do\\ngnIFsJBQxOKRwboOpg2YZtl=\\n-----END PRIVATE KEY-----\\n","client_email":"laura-robot@fake-credentials.iam.gserviceaccount.com"}',
      subject: 'test@faketestorg.cityblock.engineering',
      GCS_PATIENT_BUCKET: 'test-patient-data',
    };
  }

  const storage = Storage({
    credentials: JSON.parse(finalConfig.GCP_CREDS || ''),
  });
  const bucket = storage.bucket(finalConfig.GCS_PATIENT_BUCKET || '');
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
      // TODO: Rip this out once gcs storage bug is fixed
      const cleanedFileContents = dataFileContents.split('\n')[0];
      return JSON.parse(cleanedFileContents);
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

export const loadPatientClaimsEncounters = async (patientId: string): Promise<IPatientEncounter[]> => {
  const rawPatientEncounters = await loadPatientAggregatedDataFile(patientId, 'claims-encounters');
  const patientEncounters = await parsePatientAggregatedDataFile(rawPatientEncounters);

  return patientEncounters.map(patientEncounter => {
    const id = crypto
      .createHash('md5')
      .update(JSON.stringify(patientEncounter))
      .digest('hex');

    return {
      id,
      source: 'Claims',
      date: patientEncounter.date,
      title: patientEncounter.procName,
      location: null,
      notes: null,
      progressNoteId: null,
    };
  });
};

export const loadPatientCcdEncounters = async (patientId: string): Promise<IPatientEncounter[]> => {
  const rawPatientEncounters = await loadPatientAggregatedDataFile(patientId, 'encounters');
  const patientEncounters = await parsePatientAggregatedDataFile(rawPatientEncounters);

  return patientEncounters.map(patientEncounter => {
    const id = crypto
      .createHash('md5')
      .update(JSON.stringify(patientEncounter))
      .digest('hex');

    const encounterData = patientEncounter.encounter;
    const patientData = patientEncounter.patient;
    const location = encounterData.Locations.length ? encounterData.Locations[0].Name : null;
    const notes = encounterData.ReasonForVisit.length ? encounterData.ReasonForVisit[0].Name : null;

    return {
      id,
      location,
      source: patientData.source.name,
      date: encounterData.DateTime,
      title: encounterData.Type.Name,
      notes,
      progressNoteId: null,
    };
  });
};

export const loadPatientEncounters = async (patientId: string): Promise<IPatientEncounter[]> => {
  const patientCcdEncounters = await loadPatientCcdEncounters(patientId);
  const patientClaimsEncounters = await loadPatientClaimsEncounters(patientId);

  return patientCcdEncounters.concat(patientClaimsEncounters);
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
