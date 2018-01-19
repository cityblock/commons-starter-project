import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import RedoxApi from '../../apis/redox';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockPatient,
  createMockUser,
  createPatient,
  mockRedoxGetPatientEncounters,
  mockRedoxTokenFetch,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
}

const userRole = 'physician';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(
    {
      departmentId: 1,
      name: 'Center Zero',
    },
    txn,
  );
  const user = await User.create(createMockUser(1, clinic.id, userRole), txn);
  const patient = await createPatient(createMockPatient(1, clinic.id), user.id, txn);

  return { patient };
}

describe('patient encounters', () => {
  let redoxApi: RedoxApi;
  let db: Db;

  beforeEach(async () => {
    redoxApi = await RedoxApi.get();
    db = await Db.get();
    await Db.clear();
    mockRedoxTokenFetch();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('when a patient has no encounters', () => {
    it('returns an empty response', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient } = await setup(txn);
        const query = `{
          patientEncounters(patientId: "${patient.id}") {
            encounterType
            providerName
          }
        }`;

        mockRedoxGetPatientEncounters([]);

        const result = await graphql(schema, query, null, {
          redoxApi,
          db,
          userRole,
          txn,
        });
        expect(cloneDeep(result.data!.patientEncounters)).toMatchObject([]);
      });
    });
  });

  describe('when a patient has encounters', () => {
    it('returns patient encounters', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient } = await setup(txn);
        const query = `{
          patientEncounters(patientId: "${patient.id}") {
            encounterType
          }
        }`;

        mockRedoxGetPatientEncounters([
          {
            Type: {
              Code: '99222',
              CodeSystem: '2.16.840.1.113883.6.12',
              CodeSystemName: 'CPT',
              Name: 'InPatient Admission',
            },
            Providers: [],
            Locations: [],
            ReasonForVisit: [],
            Diagnosis: [],
          },
        ]);

        const result = await graphql(schema, query, null, { redoxApi, db, userRole, txn });
        expect(cloneDeep(result.data!.patientEncounters)).toMatchObject([
          {
            encounterType: 'InPatient Admission',
          },
        ]);
      });
    });
  });
});
