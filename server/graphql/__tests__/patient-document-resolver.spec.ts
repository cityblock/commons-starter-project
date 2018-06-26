import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import uuid from 'uuid/v4';
import getPatientDocumentsByType from '../../../app/graphql/queries/get-patient-documents-by-type.graphql';
import getPatientDocuments from '../../../app/graphql/queries/get-patient-documents.graphql';
import patientDocumentCreate from '../../../app/graphql/queries/patient-document-create-mutation.graphql';
import patientDocumentDelete from '../../../app/graphql/queries/patient-document-delete-mutation.graphql';
import patientDocumentSignedUrlCreate from '../../../app/graphql/queries/patient-document-signed-url-create.graphql';

import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientDocument from '../../models/patient-document';
import User from '../../models/user';
import { createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
}

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';

async function setup(trx: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic',
      departmentId: 1,
    },
    trx,
  );
  const homeClinicId = homeClinic.id;
  const user = await User.create(
    {
      firstName: 'Daenerys',
      lastName: 'Targaryen',
      email: 'a@b.com',
      userRole,
      homeClinicId,
    },
    trx,
  );
  const patient = await createPatient({ cityblockId: 123, homeClinicId }, trx);
  return { patient, user };
}

describe('patient document resolver', () => {
  let txn = null as any;
  const log = jest.fn();
  const logger = { log };
  const patientDocumentCreateMutation = print(patientDocumentCreate);
  const patientDocumentDeleteMutation = print(patientDocumentDelete);
  const getPatientDocumentsQuery = print(getPatientDocuments);
  const getPatientDocumentsByTypeQuery = print(getPatientDocumentsByType);
  const patientDocumentSignedUrlCreateMutation = print(patientDocumentSignedUrlCreate);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create patient document', async () => {
    it('should create patient document', async () => {
      const { user, patient } = await setup(txn);

      const patientDocument = {
        patientId: patient.id,
        filename: 'test.pdf',
        description: 'some description',
        documentType: 'hcp',
      };

      const result = await graphql(
        schema,
        patientDocumentCreateMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        patientDocument,
      );

      expect(cloneDeep(result.data!.patientDocumentCreate)).toMatchObject({
        ...patientDocument,
        uploadedBy: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
      expect(log).toBeCalled();
    });

    it('should create patient document with supplied id', async () => {
      const { user, patient } = await setup(txn);

      const patientDocument = {
        id: uuid(),
        patientId: patient.id,
        filename: 'test.pdf',
        description: 'some description',
        documentType: 'hcp',
      };

      const result = await graphql(
        schema,
        patientDocumentCreateMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        patientDocument,
      );

      expect(cloneDeep(result.data!.patientDocumentCreate)).toMatchObject({
        ...patientDocument,
        uploadedBy: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
      expect(log).toBeCalled();
    });

    it('should error on creating a patient document with non uuid id', async () => {
      const { user, patient } = await setup(txn);

      const patientDocument = {
        id: 12343,
        patientId: patient.id,
        filename: 'test.pdf',
        description: 'some description',
        documentType: 'hcp',
      };

      const result = await graphql(
        schema,
        patientDocumentCreateMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        patientDocument,
      );

      expect(cloneDeep(result).errors![0].message).toBe('id: should match format "uuid"');
      expect(log).toBeCalled();
    });
  });

  describe('create patient document signed url', async () => {
    it('returns a signed URL for patient document upload', async () => {
      const { patient, user } = await setup(txn);

      const testConfig = {
        GCS_PROJECT_ID: 'project=laura-test-project-198219',
        GCS_PATIENT_BUCKET: 'laura_test_patient_documents',
        GCP_CREDS:
          '{"private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyxrqMnMzxS81l\\n0fbRMDgg2je3wDLBOg96cSnIcb4cq2mmKQwYUQyzSikcVhBF4OwJOuybntOtxlyG\\nDz9f66rW8G4hKdcz0m7Og6fcMP25BT4plVOMNPZPjFu66RJE1ZNqiv6uzZXEgOAn\\na2xlXg+o0ejaqvpxe/meNad4cLjsjM2/pOqy9Pk2sBp3yFggyO1tECVFnitik+Oq\\nRm45796fCmUh8GcvPiJUg+x/u0Url0VZzVBwhiQtdEUYx/tUSWxVggNJGPUcUER2\\nFm+xcfeN5GhaxS5+ZTTZyEWhZJQxeASE17jBl8c7XkDqMQlwotK0GS/hhLluFJvP\\nBAF5B4+dAgMBAAECggEAEcRAK9M1ZtGCsxi/r6BcI5+sI9287YkImsF+RoZPP2gl\\nkrbHle8QFQ1Msp029srYij5J31lUbhOlhEklojG4g63XNAKFeYfzLSDWYMKZpHaJ\\n6/YEHI3y4IrxXszk3ORgxxjTIKobtTCdli1N03Eam0tpGboeM4L/lqJ8ZzLEnfVh\\nXr9A47wgJpB4CZh1ipjmqDQJQ8Ej3JygaXErT04J0mmGs9ZO2M/ijl2PubqibcQs\\njt2MKGMcwVTXxjqES5tjUYKzYpl9IW2528SRUiYH5egQiEr7EUd4m2dWouiQ4UEj\\nJGCbrrOySzMLFcLD7XwuLyze6kkz121MM4vSG8rS4QKBgQD1HvHBuYN4eUd08gkb\\npDZs4zFBjI8okNkZfsvr/o8GFHdm+5in60dXda13ZtrzYT+Bl+ck/jarEZlWgqV6\\nEcti6i58xVP7FLc3bAZg0BMrYAEDYlVeuFZex99nbaawUlY6JyPQppgCX6AY1EhD\\nnfgS1yXl5Ziiom1ASQEiulU7hQKBgQC6tfqsBWRM8l5xUlCz0UJi7+G9kKLbIUQL\\nnJQRP3PTX9/KzUZi5EOzKLp3zEEz3N8fLn9YI9hUu7qAGC/ZLrHORIfOeOL6Tt2C\\nvcrWNlYHzxVp6LG2r6vyYA1XpeDheyMIXuRKPYjAJU91ru70vpPOyQ8xVUKYt2fa\\nhv40zQvDOQKBgE6yhanN1tDqFzALuTLfsP2an6jM6PV8M8eEtxHoo6CvF3q/0k4v\\nMrN4u523LxquoUYJMBPnbkPUHafxwBEF/4edahly/TiCeSRZEV8pzs3BP/IHMyN7\\nCXfasfYx9S9s7/QxtsT5h5pTe0Idfan/4LKj0q4R3cRxY6QdDDlLG6xFAoGAPueQ\\nzOQEJuiBaSyShAK8mxi2tWdFdw5+Hmtid20pWM20WF9Ql4DQTkwqhrIKRa7kfVzt\\nCoUJHYMiEoYTmNhij1wHZUjVL//iIWpQLFuiIH9kd4ouVZ5aEA7Mb/szCMSzyN4v\\ni9Ovfw0S+FM3rr2GjuSuebB//3PLSZSxkJiEngECgYEA416H0a457vjnN6mzTktD\\nXI3Na36Q/VdXmMR5f9GXagpsBIO101XM7U3YY36jD7GzQaOQpZvwiZKy0jVLfx8B\\nXb1Ugj9ljqyWt9K0Fni+LrsvkV2pPURokdT3j+DfcnOklUMAPQzzZZ2FfkFX80do\\ngnIFsJBQxOKRwboOpg2YZtl=\\n-----END PRIVATE KEY-----\\n","client_email":"laura-robot@fake-credentials.iam.gserviceaccount.com"}',
      };

      const result = await graphql(
        schema,
        patientDocumentSignedUrlCreateMutation,
        null,
        {
          userId: user.id,
          permissions,
          testTransaction: txn,
          testConfig,
        },
        {
          patientId: patient.id,
          action: 'write',
          documentId: uuid(),
        },
      );

      expect(result.data!.patientDocumentSignedUrlCreate.signedUrl).toMatch('fake-credentials');
    });

    it('throws an error if patient id not provided', async () => {
      const { user } = await setup(txn);

      const testConfig = {
        GCS_PROJECT_ID: 'project=laura-test-project-198219',
        GCS_BUCKET: 'laura_test_patient_documents',
        GCP_CREDS:
          '{"private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyxrqMnMzxS81l\\n0fbRMDgg2je3wDLBOg96cSnIcb4cq2mmKQwYUQyzSikcVhBF4OwJOuybntOtxlyG\\nDz9f66rW8G4hKdcz0m7Og6fcMP25BT4plVOMNPZPjFu66RJE1ZNqiv6uzZXEgOAn\\na2xlXg+o0ejaqvpxe/meNad4cLjsjM2/pOqy9Pk2sBp3yFggyO1tECVFnitik+Oq\\nRm45796fCmUh8GcvPiJUg+x/u0Url0VZzVBwhiQtdEUYx/tUSWxVggNJGPUcUER2\\nFm+xcfeN5GhaxS5+ZTTZyEWhZJQxeASE17jBl8c7XkDqMQlwotK0GS/hhLluFJvP\\nBAF5B4+dAgMBAAECggEAEcRAK9M1ZtGCsxi/r6BcI5+sI9287YkImsF+RoZPP2gl\\nkrbHle8QFQ1Msp029srYij5J31lUbhOlhEklojG4g63XNAKFeYfzLSDWYMKZpHaJ\\n6/YEHI3y4IrxXszk3ORgxxjTIKobtTCdli1N03Eam0tpGboeM4L/lqJ8ZzLEnfVh\\nXr9A47wgJpB4CZh1ipjmqDQJQ8Ej3JygaXErT04J0mmGs9ZO2M/ijl2PubqibcQs\\njt2MKGMcwVTXxjqES5tjUYKzYpl9IW2528SRUiYH5egQiEr7EUd4m2dWouiQ4UEj\\nJGCbrrOySzMLFcLD7XwuLyze6kkz121MM4vSG8rS4QKBgQD1HvHBuYN4eUd08gkb\\npDZs4zFBjI8okNkZfsvr/o8GFHdm+5in60dXda13ZtrzYT+Bl+ck/jarEZlWgqV6\\nEcti6i58xVP7FLc3bAZg0BMrYAEDYlVeuFZex99nbaawUlY6JyPQppgCX6AY1EhD\\nnfgS1yXl5Ziiom1ASQEiulU7hQKBgQC6tfqsBWRM8l5xUlCz0UJi7+G9kKLbIUQL\\nnJQRP3PTX9/KzUZi5EOzKLp3zEEz3N8fLn9YI9hUu7qAGC/ZLrHORIfOeOL6Tt2C\\nvcrWNlYHzxVp6LG2r6vyYA1XpeDheyMIXuRKPYjAJU91ru70vpPOyQ8xVUKYt2fa\\nhv40zQvDOQKBgE6yhanN1tDqFzALuTLfsP2an6jM6PV8M8eEtxHoo6CvF3q/0k4v\\nMrN4u523LxquoUYJMBPnbkPUHafxwBEF/4edahly/TiCeSRZEV8pzs3BP/IHMyN7\\nCXfasfYx9S9s7/QxtsT5h5pTe0Idfan/4LKj0q4R3cRxY6QdDDlLG6xFAoGAPueQ\\nzOQEJuiBaSyShAK8mxi2tWdFdw5+Hmtid20pWM20WF9Ql4DQTkwqhrIKRa7kfVzt\\nCoUJHYMiEoYTmNhij1wHZUjVL//iIWpQLFuiIH9kd4ouVZ5aEA7Mb/szCMSzyN4v\\ni9Ovfw0S+FM3rr2GjuSuebB//3PLSZSxkJiEngECgYEA416H0a457vjnN6mzTktD\\nXI3Na36Q/VdXmMR5f9GXagpsBIO101XM7U3YY36jD7GzQaOQpZvwiZKy0jVLfx8B\\nXb1Ugj9ljqyWt9K0Fni+LrsvkV2pPURokdT3j+DfcnOklUMAPQzzZZ2FfkFX80do\\ngnIFsJBQxOKRwboOpg2YZtl=\\n-----END PRIVATE KEY-----\\n","client_email":"laura-robot@fake-credentials.iam.gserviceaccount.com"}',
      };

      const result = await graphql(
        schema,
        patientDocumentSignedUrlCreateMutation,
        null,
        {
          userId: user.id,
          permissions,
          testTransaction: txn,
          testConfig,
        },
        {
          patientId: '',
          action: 'write',
          documentId: uuid(),
        },
      );

      expect(result.errors![0].message).toBe('Must provide patient id');
    });
  });

  describe('delete patient document', async () => {
    it('should delete patient document', async () => {
      const { patient, user } = await setup(txn);

      const patientDocument = {
        patientId: patient.id,
        filename: 'test.pdf',
      };

      const document = await PatientDocument.create(
        { ...patientDocument, uploadedById: user.id },
        txn,
      );

      const result = await graphql(
        schema,
        patientDocumentDeleteMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientDocumentId: document.id,
        },
      );

      expect(cloneDeep(result.data!.patientDocumentDelete)).toMatchObject({
        ...patientDocument,
        uploadedBy: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
      expect(log).toBeCalled();
    });
  });

  describe('resolvers', async () => {
    it('should get all patient documents', async () => {
      const { patient, user } = await setup(txn);
      const document1 = {
        patientId: patient.id,
        filename: 'test2.txt',
        documentType: 'hipaaConsent' as any,
      };
      await PatientDocument.create({ ...document1, uploadedById: user.id }, txn);

      const document2 = {
        patientId: patient.id,
        filename: 'test3.txt',
        documentType: 'hieHealthixConsent' as any,
      };
      await PatientDocument.create({ ...document2, uploadedById: user.id }, txn);

      const result = await graphql(
        schema,
        getPatientDocumentsQuery,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientId: patient.id,
        },
      );

      expect(cloneDeep(result.data!.patientDocuments).length).toBe(2);
      expect(cloneDeep(result.data!.patientDocuments)).toContainEqual(
        expect.objectContaining({
          ...document1,
          uploadedBy: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        }),
      );
      expect(cloneDeep(result.data!.patientDocuments)).toContainEqual(
        expect.objectContaining({
          ...document2,
          uploadedBy: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        }),
      );
      expect(log).toBeCalled();
    });

    it('should get patient documents of a specific type', async () => {
      const { patient, user } = await setup(txn);
      const document1 = {
        patientId: patient.id,
        filename: 'test2.txt',
        documentType: 'hipaaConsent' as any,
      };
      await PatientDocument.create({ ...document1, uploadedById: user.id }, txn);

      const document2 = {
        patientId: patient.id,
        filename: 'test3.txt',
        documentType: 'hieHealthixConsent' as any,
      };
      await PatientDocument.create({ ...document2, uploadedById: user.id }, txn);

      const result = await graphql(
        schema,
        getPatientDocumentsByTypeQuery,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientId: patient.id,
          documentType: 'hieHealthixConsent' as any,
        },
      );

      expect(cloneDeep(result.data!.patientDocumentsByType).length).toBe(1);
      expect(cloneDeep(result.data!.patientDocumentsByType)).toContainEqual(
        expect.objectContaining({
          ...document2,
          uploadedBy: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        }),
      );
      expect(log).toBeCalled();
    });
  });
});
