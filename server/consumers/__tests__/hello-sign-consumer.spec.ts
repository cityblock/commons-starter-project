import { transaction, Transaction } from 'objection';
import { DocumentTypeOptions, UserRole } from 'schema';
import uuid from 'uuid/v4';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientDocument from '../../models/patient-document';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import { createPatientDocument } from '../hello-sign-consumer';

interface ISetup {
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic('The Wall', 123455), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'admin' as UserRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return { user, patient };
}

describe('HelloSign Consumer', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientDocument.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('createPatientDocument', () => {
    it('creates a patient document from given information', async () => {
      const { patient, user } = await setup(txn);
      const id = uuid();

      await createPatientDocument(
        {
          patientId: patient.id,
          userId: user.id,
          documentType: 'textConsent' as DocumentTypeOptions,
          requestId: 'winterIsComing',
        },
        id,
        txn,
      );

      const documents = await PatientDocument.getAllForPatient(patient.id, txn);

      expect(documents.length).toBe(1);
      expect(documents[0]).toMatchObject({
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'textConsent.pdf',
        documentType: 'textConsent',
      });
    });
  });
});
