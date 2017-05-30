import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import AthenaApi from '../../apis/athena';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockAthenaPatientEncounters,
  createMockPatient,
  createPatient,
  mockAthenaGetPatientEncounters,
  mockAthenaTokenFetch,
  restoreAthenaFetch,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient encounters', () => {
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

  describe('when a patient has no encounters', () => {
    it('returns an empty response', async () => {
      const query = `{
        patientEncounters(patientId: "${patient.id}") {
          edges {
            node {
              encounterType
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }`;

      mockAthenaGetPatientEncounters({encounters: []});

      const result = await graphql(schema, query, null, { athenaApi, db, userRole });
      expect(cloneDeep(result.data!.patientEncounters)).toMatchObject({
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });
  });

  describe('when a patient has encounters', () => {
    describe('pagination', () => {
      it('correctly calculates the limit and offset params', async () => {
        const fakeAthenaApi = {
          patientEncountersGet: jest.fn(),
        };

        fakeAthenaApi.patientEncountersGet.mockReturnValueOnce({encounters: []});

        const query = `{
          patientEncounters(patientId: "${patient.id}", pageSize: 2, pageNumber: 2) {
            edges {
              node {
                encounterType
              }
            }
          }
        }`;

        await graphql(schema, query, null, { athenaApi: fakeAthenaApi, db, userRole });
        expect(fakeAthenaApi.patientEncountersGet).toBeCalledWith(
          patient.athenaPatientId,
          clinic.departmentId,
          2,
          2,
        );
      });

      describe('when there are more results', () => {
        it('returns patient encounters with previous and next fields', async () => {
          const query = `{
            patientEncounters(patientId: "${patient.id}") {
              edges {
                node {
                  encounterType
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }`;

          mockAthenaGetPatientEncounters(createMockAthenaPatientEncounters({
            hasPreviousPage: true,
            hasNextPage: true,
          }));

          const result = await graphql(schema, query, null, { athenaApi, db, userRole });
          expect(cloneDeep(result.data!.patientEncounters)).toMatchObject({
            edges: [{
              node: {
                encounterType: 'VISIT',
              },
            }],
            pageInfo: {
              hasPreviousPage: true,
              hasNextPage: true,
            },
          });
        });
      });

      describe('when there are no more results', () => {
        it('returns patient encounters without previous and next fields', async () => {
          const query = `{
            patientEncounters(patientId: "${patient.id}") {
              edges {
                node {
                  encounterType
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }`;

          mockAthenaGetPatientEncounters(createMockAthenaPatientEncounters({
            hasPreviousPage: false,
            hasNextPage: false,
          }));

          const result = await graphql(schema, query, null, { athenaApi, db, userRole });
          expect(cloneDeep(result.data!.patientEncounters)).toMatchObject({
            edges: [{
              node: {
                encounterType: 'VISIT',
              },
            }],
            pageInfo: {
              hasPreviousPage: false,
              hasNextPage: false,
            },
          });
        });
      });
    });
  });
});
