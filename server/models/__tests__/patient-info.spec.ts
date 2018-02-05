import { transaction, Transaction } from 'objection';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockPatientInfo,
  createMockUser,
} from '../../spec-helpers';
import Address from '../address';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientInfo from '../patient-info';
import User from '../user';

const userRole = 'admin';

interface ISetup {
  patient: Patient;
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await Patient.query(txn).insertAndFetch(createMockPatient(123, clinic.id));

  return { patient, user };
}

describe('patient info model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', async () => {
    it('should create patient info', async () => {
      await transaction(PatientInfo.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const patientInfo = await PatientInfo.create(
          {
            ...createMockPatientInfo(),
            patientId: patient.id,
            updatedBy: user.id,
          },
          txn,
        );
        expect(patientInfo).toMatchObject({
          patientId: patient.id,
          gender: 'male',
          language: 'en',
        });
      });
    });
  });

  describe('edit', async () => {
    it('should edit patient info', async () => {
      await transaction(PatientInfo.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const patientInfo = await PatientInfo.create(
          {
            ...createMockPatientInfo(),
            patientId: patient.id,
            updatedBy: user.id,
          },
          txn,
        );
        const result = await PatientInfo.edit(
          {
            gender: 'female',
            language: 'ch',
            updatedBy: user.id,
          },
          patientInfo.id,
          txn,
        );

        expect(result).toMatchObject({
          patientId: patient.id,
          id: patientInfo.id,
          gender: 'female',
          language: 'ch',
          primaryAddress: null,
        });
      });
    });

    it('should add address to patient info', async () => {
      await transaction(PatientInfo.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const patientInfo = await PatientInfo.create(
          {
            ...createMockPatientInfo(),
            patientId: patient.id,
            updatedBy: user.id,
          },
          txn,
        );
        const address = await Address.create(
          {
            street: '44 Washington St',
            zip: '10010',
            state: 'NY',
            city: 'Brooklyn',
            updatedBy: user.id,
          },
          txn,
        );

        const result = await PatientInfo.edit(
          {
            primaryAddressId: address.id,
            updatedBy: user.id,
          },
          patientInfo.id,
          txn,
        );

        expect(result).toMatchObject({
          patientId: patient.id,
          id: patientInfo.id,
          gender: 'male',
          language: 'en',
          primaryAddress: {
            street: '44 Washington St',
            zip: '10010',
            state: 'NY',
            city: 'Brooklyn',
            updatedBy: user.id,
          },
        });
      });
    });
  });
});
