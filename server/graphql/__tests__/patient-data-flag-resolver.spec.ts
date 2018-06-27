import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientDataFlag from '../../models/patient-data-flag';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';

interface ISetup {
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return { user, patient };
}

describe('computed field resolver', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('patient data flag create', () => {
    it('creates a patient data flag with a suggestedValue', async () => {
      const { user, patient } = await setup(txn);
      const suggestedValue = 'Darth';
      const patientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);
      expect(patientDataFlags.length).toEqual(0);

      const mutation = `mutation {
          patientDataFlagCreate(input: {
            patientId: "${patient.id}"
            fieldName: firstName
            suggestedValue: "${suggestedValue}"
          }) {
            suggestedValue
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        testTransaction: txn,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientDataFlagCreate)).toMatchObject({ suggestedValue });

      const refetchedPatientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);
      expect(refetchedPatientDataFlags.length).toEqual(1);
    });

    it('creates a patient data flag without a suggestedValue', async () => {
      const { user, patient } = await setup(txn);
      const fieldName = 'firstName';
      const patientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);
      expect(patientDataFlags.length).toEqual(0);

      const mutation = `mutation {
          patientDataFlagCreate(input: {
            patientId: "${patient.id}"
            fieldName: ${fieldName}
          }) {
            fieldName
            suggestedValue
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        testTransaction: txn,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientDataFlagCreate)).toMatchObject({
        fieldName,
        suggestedValue: null,
      });

      const refetchedPatientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);
      expect(refetchedPatientDataFlags.length).toEqual(1);
    });
  });
});
