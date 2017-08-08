import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import RedoxApi from '../../apis/redox';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockPatient,
  createPatient,
  mockRedoxGetPatientMedications,
  mockRedoxTokenFetch,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient medications', () => {
  let redoxApi: RedoxApi = null as any;
  let db: Db = null as any;
  let patient: Patient = null as any;
  let user: User = null as any;
  let clinic: Clinic = null as any;

  const userRole = 'physician';

  beforeEach(async () => {
    redoxApi = await RedoxApi.get();
    db = await Db.get();
    await Db.clear();
    mockRedoxTokenFetch();

    clinic = await Clinic.create({
      departmentId: 1,
      name: 'Center Zero',
    });
    user = await User.create({
      email: 'a@b.com',
      userRole,
      homeClinicId: clinic.id,
    });
    patient = await createPatient(createMockPatient(1, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('when a patient has no medications', () => {
    it('returns an empty response', async () => {
      const query = `{
        patientMedications(patientId: "${patient.id}") {
          medications {
            active {
              name
            }
            inactive {
              name
            }
          }
        }
      }`;

      mockRedoxGetPatientMedications([]);

      const result = await graphql(schema, query, null, { redoxApi, db, userRole });
      expect(cloneDeep(result.data!.patientMedications)).toMatchObject({
        medications: {
          active: [],
          inactive: [],
        },
      });
    });
  });

  describe('when a patient has medications', () => {
    it('returns patient medications', async () => {
      const query = `{
        patientMedications(patientId: "${patient.id}") {
          medications {
            active {
              name
            }
            inactive {
              name
            }
          }
        }
      }`;

      mockRedoxGetPatientMedications([{
        Prescription: false,
        Dose: {
          Quantity: '4',
          Units: 'mg',
        },
        StartDate: '2013-11-11T05:00:00.000Z',
        Frequency: {
          Period: '8',
          Unit: 'h',
        },
        Product: {
          Code: '104894',
          CodeSystem: '2.16.840.1.113883.6.88',
          CodeSystemName: 'RxNorm',
          Name: 'Active Medication 1',
        },
      }, {
        Prescription: false,
        Dose: {
          Quantity: '4',
          Units: 'mg',
        },
        StartDate: '2013-11-11T05:00:00.000Z',
        EndDate: '2012-11-11T05:00:00.000Z',
        Frequency: {
          Period: '8',
          Unit: 'h',
        },
        Product: {
          Code: '104894',
          CodeSystem: '2.16.840.1.113883.6.88',
          CodeSystemName: 'RxNorm',
          Name: 'Inactive Medication 1',
        },
      }, {
        Prescription: false,
        Dose: {
          Quantity: '4',
          Units: 'mg',
        },
        StartDate: '5000-11-11T05:00:00.000Z',
        Frequency: {
          Period: '8',
          Unit: 'h',
        },
        Product: {
          Code: '104894',
          CodeSystem: '2.16.840.1.113883.6.88',
          CodeSystemName: 'RxNorm',
          Name: 'Active Medication 2',
        },
      }]);

      const result = await graphql(schema, query, null, { redoxApi, db, userRole });
      expect(cloneDeep(result.data!.patientMedications)).toMatchObject({
        medications: {
          active: [{ name: 'Active Medication 1' }, { name: 'Active Medication 2' }],
          inactive: [{ name: 'Inactive Medication 1' }],
        },
      });
    });
  });
});
