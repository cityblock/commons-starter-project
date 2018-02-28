import { transaction, Transaction } from 'objection';
import Db from '../../db';
import {
  createMockClinic,
  createMockEmail,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Address from '../address';
import Clinic from '../clinic';
import ComputedPatientStatus from '../computed-patient-status';
import Email from '../email';
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
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

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

  describe('createInitialPatientInfo', async () => {
    it('should create an initial patient info', async () => {
      await transaction(PatientInfo.knex(), async txn => {
        const { patient } = await setup(txn);
        expect(patient.patientInfo).not.toBeNull();
      });
    });

    it('does not create a second patient info', async () => {
      await transaction(PatientInfo.knex(), async txn => {
        const { user, patient } = await setup(txn);
        const { patientInfo } = patient;

        const newPatientInfo = await PatientInfo.createInitialPatientInfo(
          {
            patientId: patient.id,
            updatedById: user.id,
          },
          txn,
        );

        expect(newPatientInfo.id).toEqual(patientInfo.id);
      });
    });
  });

  describe('edit', async () => {
    it('should edit patient info', async () => {
      await transaction(PatientInfo.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const result = await PatientInfo.edit(
          {
            gender: 'female',
            language: 'ch',
            updatedById: user.id,
          },
          patient.patientInfo.id,
          txn,
        );

        expect(result).toMatchObject({
          patientId: patient.id,
          id: patient.patientInfo.id,
          gender: 'female',
          language: 'ch',
          primaryAddress: null,
        });
      });
    });

    it('should add address to patient info', async () => {
      await transaction(PatientInfo.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const address = await Address.create(
          {
            street1: '44 Washington St',
            zip: '10010',
            state: 'NY',
            city: 'Brooklyn',
            updatedById: user.id,
          },
          txn,
        );

        const result = await PatientInfo.edit(
          {
            primaryAddressId: address.id,
            updatedById: user.id,
          },
          patient.patientInfo.id,
          txn,
        );

        expect(result).toMatchObject({
          patientId: patient.id,
          id: patient.patientInfo.id,
          gender: 'male',
          language: 'en',
          primaryAddress: {
            street1: '44 Washington St',
            zip: '10010',
            state: 'NY',
            city: 'Brooklyn',
            updatedById: user.id,
          },
        });
      });
    });

    it('should update computed patient status', async () => {
      await transaction(PatientInfo.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

        expect(computedPatientStatus!.isDemographicInfoUpdated).toEqual(false);

        await PatientInfo.edit(
          {
            gender: 'female',
            language: 'ch',
            updatedById: user.id,
          },
          patient.patientInfo.id,
          txn,
        );
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.isDemographicInfoUpdated).toEqual(true);
      });
    });

    it('should add email to patient info', async () => {
      await transaction(PatientInfo.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const email = await Email.create(createMockEmail(user.id), txn);

        const result = await PatientInfo.edit(
          {
            primaryEmailId: email.id,
            updatedById: user.id,
          },
          patient.patientInfo.id,
          txn,
        );

        expect(result).toMatchObject({
          patientId: patient.id,
          id: patient.patientInfo.id,
          gender: 'male',
          language: 'en',
          primaryEmail: {
            emailAddress: 'spam@email.com',
            description: 'spam email',
            updatedById: user.id,
          },
        });
      });
    });
  });
});
