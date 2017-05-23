import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import AthenaApi from '../../apis/athena';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockAthenaPatientMedications,
  createMockPatient,
  createPatient,
  mockAthenaGetPatientMedications,
  mockAthenaTokenFetch,
  restoreAthenaFetch,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient medications', () => {
  let athenaApi: AthenaApi = null as any;
  let db: Db = null as any;
  let patient: Patient = null as any;
  let user: User = null as any;
  let clinic: Clinic = null as any;

  const userRole = 'physician';

  beforeEach(async () => {
    athenaApi = await AthenaApi.get();
    db = await Db.get();
    await Db.clear();
    mockAthenaTokenFetch();

    clinic = await Clinic.create({
      departmentId: 1,
      name: 'Center Zero',
    });
    user = await User.create({
      email: 'a@b.com',
      password: 'password1',
      userRole,
      homeClinicId: clinic.id,
    });
    patient = await createPatient(createMockPatient(1, clinic.id), user.id);
  });

  afterEach(async () => {
    restoreAthenaFetch();
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
              status
              lastUpdated
              historical
              history {
                events {
                  date
                  event
                }
              }
            }
            inactive {
              name
              status
              lastUpdated
              historical
              history {
                events {
                  date
                  event
                }
              }
            }
          }
        }
      }`;

      mockAthenaGetPatientMedications({nomedicationsreported: true});

      const result = await graphql(schema, query, null, { athenaApi, db, userRole });
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
              status
              lastUpdated
              historical
              history {
                events {
                  date
                  event
                }
              }
            }
            inactive {
              name
              status
              lastUpdated
              historical
              history {
                events {
                  date
                  event
                }
              }
            }
          }
        }
      }`;

      mockAthenaGetPatientMedications(createMockAthenaPatientMedications());

      const result = await graphql(schema, query, null, { athenaApi, db, userRole });
      expect(cloneDeep(result.data!.patientMedications)).toMatchObject({
        medications: {
          active: [{
            name: 'Crestor 10 mg tablet',
            status: 'ENTER',
            lastUpdated: '01/09/2016',
            historical: false,
            history: {
              events: [{
                date: '01/09/2016',
                event: 'ENTER',
              }],
            },
          }, {
            name: 'Crestor 40 mg tablet',
            status: 'ENTER',
            lastUpdated: '01/09/2016',
            historical: true,
            history: {
              events: [{
                date: '01/09/2016',
                event: 'ENTER',
              }],
            },
          }],
          inactive: [{
            name: 'Coumadin 2 mg tablet',
            status: 'HIDE',
            lastUpdated: '06/11/2013',
            historical: true,
            history: {
              events: [{
                date: '06/11/2013',
                event: 'HIDE',
              }, {
                date: '05/10/2011',
                event: 'ENTER',
              }, {
                date: '04/20/2011',
                event: 'FILL',
              }, {
                date: '04/20/2011',
                event: 'START',
              }, {
                date: '04/20/2011',
                event: 'ORDER',
              }, {
                date: '04/20/2011',
                event: 'ORDER',
              }],
            },
          }],
        },
      });
    });
  });
});
