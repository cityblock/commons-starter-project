import Storage from '@google-cloud/storage';
import HelloSign from 'hellosign-sdk';
import { transaction, Transaction } from 'objection';
import { DocumentTypeOptions } from 'schema';
import sleep from 'sleep-promise';
import uuid from 'uuid/v4';
import config from '../config';
import PatientDocument from '../models/patient-document';
import PubSub from '../subscriptions';

const hellosign = HelloSign({ key: config.HELLOSIGN_API_KEY });

const MAX_RETRIES = 20;

interface IProcessHelloSignData {
  userId: string;
  patientId: string;
  requestId: string;
  documentType: DocumentTypeOptions;
}

export async function processHelloSign(data: IProcessHelloSignData) {
  const ready = await checkDocumentReady(data.requestId);

  if (!ready) {
    throw new Error('Document is not ready to be transferred.');
  }

  await uploadDocument(data);
}

async function checkDocumentReady(requestId: string): Promise<boolean> {
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    const document = await hellosign.signatureRequest.get(requestId);

    if (document.signature_request.is_complete) {
      return true;
    }

    await sleep(400);
    retryCount++;
  }

  return false;
}

export async function createPatientDocument(
  data: IProcessHelloSignData,
  id: string,
  existingTxn?: Transaction,
): Promise<void> {
  await transaction(existingTxn || PatientDocument.knex(), async txn => {
    const patientDocument = await PatientDocument.create(
      {
        id,
        patientId: data.patientId,
        uploadedById: data.userId,
        filename: `${data.documentType}.pdf`,
        documentType: data.documentType,
      },
      txn,
    );

    publishMessage(patientDocument);
  });
}

export async function uploadDocument(data: IProcessHelloSignData, testConfig?: any): Promise<void> {
  const finalConfig = testConfig || config;
  const storage = Storage({
    projectId: finalConfig.GCS_PROJECT_ID || '',
    credentials: JSON.parse(finalConfig.GCP_CREDS || ''),
  });

  const id = uuid();
  const filename = `${data.patientId}/documents/${id}`;

  const bucket = storage.bucket(finalConfig.GCS_PATIENT_BUCKET || '');
  const file = bucket.file(filename);

  const document = await hellosign.signatureRequest.download(data.requestId, {
    file_type: 'pdf',
  });

  const stream = file.createWriteStream({
    metadata: {
      contentType: 'application/pdf',
    },
  });

  document.pipe(stream);

  stream.on('error', err => {
    throw err;
  });

  stream.on('finish', async () => {
    await createPatientDocument(data, id);
  });
}

function publishMessage(patientDocument: PatientDocument) {
  const pubsub = PubSub.get();

  pubsub.publish('patientDocumentCreated', {
    patientDocumentCreated: patientDocument,
    patientId: patientDocument.patientId,
  });
}
