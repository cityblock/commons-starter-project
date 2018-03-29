import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as getPatientDocuments from '../../../app/graphql/queries/get-patient-documents.graphql';
import * as patientDocumentCreate from '../../../app/graphql/queries/patient-document-create-mutation.graphql';
import * as patientDocumentDelete from '../../../app/graphql/queries/patient-document-delete-mutation.graphql';
import Db from '../../db';
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

const userRole = 'physician';
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

describe('address resolver', () => {
  let db: Db;
  let txn = null as any;
  const log = jest.fn();
  const logger = { log };
  const patientDocumentCreateMutation = print(patientDocumentCreate);
  const patientDocumentDeleteMutation = print(patientDocumentDelete);
  const getPatientDocumentsQuery = print(getPatientDocuments);

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create patient document', async () => {
    it('should create patient document', async () => {
      const { user, patient } = await setup(txn);

      const patientDocument = {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test.pdf',
        description: 'some description',
        documentType: 'hcp',
      };

      const result = await graphql(
        schema,
        patientDocumentCreateMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        patientDocument,
      );

      expect(cloneDeep(result.data!.patientDocumentCreate)).toMatchObject(patientDocument);
      expect(log).toBeCalled();
    });
  });

  describe('delete patient document', async () => {
    it('should delete patient document', async () => {
      const { patient, user } = await setup(txn);

      const patientDocument = {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test.pdf',
      };

      const document = await PatientDocument.create(patientDocument, txn);

      const result = await graphql(
        schema,
        patientDocumentDeleteMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          patientDocumentId: document.id,
        },
      );

      expect(cloneDeep(result.data!.patientDocumentDelete)).toMatchObject(patientDocument);
      expect(log).toBeCalled();
    });
  });

  describe('resolvers', async () => {
    it('should get all patient documents', async () => {
      const { patient, user } = await setup(txn);
      const document1 = {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test2.txt',
        documentType: 'hipaaConsent' as any,
      };
      await PatientDocument.create(document1, txn);

      const document2 = {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test3.txt',
        documentType: 'hieHealthixConsent' as any,
      };
      await PatientDocument.create(document2, txn);

      const result = await graphql(
        schema,
        getPatientDocumentsQuery,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          patientId: patient.id,
        },
      );
      expect(cloneDeep(result.data!.patientDocuments).length).toBe(2);
      expect(cloneDeep(result.data!.patientDocuments)).toContainEqual(
        expect.objectContaining(document1),
      );
      expect(cloneDeep(result.data!.patientDocuments)).toContainEqual(
        expect.objectContaining(document2),
      );
      expect(log).toBeCalled();
    });
  });
});
