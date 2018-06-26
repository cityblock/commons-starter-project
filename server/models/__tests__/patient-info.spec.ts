import { transaction, Transaction } from 'objection';
import { Gender, MaritalStatus, Transgender, UserRole } from 'schema';

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

const userRole = 'Pharmacist' as UserRole;

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
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientInfo.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('createInitialPatientInfo', async () => {
    it('should create an initial patient info', async () => {
      const { patient } = await setup(txn);
      expect(patient.patientInfo).not.toBeNull();
      expect(patient.patientInfo.primaryAddressId).not.toBeNull();
    });
  });

  describe('edit', async () => {
    it('should edit patient info', async () => {
      const { patient, user } = await setup(txn);
      const result = await PatientInfo.edit(
        {
          gender: 'female' as Gender,
          transgender: 'yes' as Transgender,
          maritalStatus: 'widowed' as MaritalStatus,
          language: 'ch',
          isWhite: true,
          isBlack: false,
          isAmericanIndianAlaskan: false,
          isAsian: true,
          isHawaiianPacific: false,
          isOtherRace: true,
          isHispanic: true,
          raceFreeText: 'self identified race',
          updatedById: user.id,
        },
        patient.patientInfo.id,
        txn,
      );

      expect(result).toMatchObject({
        patientId: patient.id,
        id: patient.patientInfo.id,
        gender: 'female',
        transgender: 'yes',
        maritalStatus: 'widowed',
        language: 'ch',
        isWhite: true,
        isBlack: false,
        isAmericanIndianAlaskan: false,
        isAsian: true,
        isHawaiianPacific: false,
        isOtherRace: true,
        isHispanic: true,
        raceFreeText: 'self identified race',
      });
    });

    it('should add address to patient info', async () => {
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
        gender: 'male' as Gender,
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

    it('should update computed patient status', async () => {
      const { patient, user } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isDemographicInfoUpdated).toEqual(false);

      await PatientInfo.edit(
        {
          gender: 'female' as Gender,
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

    it('should add email to patient info', async () => {
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
        gender: 'male' as Gender,
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
