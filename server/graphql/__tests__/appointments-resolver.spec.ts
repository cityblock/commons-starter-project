import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import AthenaApi from '../../apis/athena';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import {
  mockAthenaAddNoteToAppointment,
  mockAthenaAddNoteToAppointmentError,
  mockAthenaBookAppointment,
  mockAthenaBookAppointmentError,
  mockAthenaCheckinAppointment,
  mockAthenaCheckinAppointmentError,
  mockAthenaCheckoutAppointment,
  mockAthenaCheckoutAppointmentError,
  mockAthenaOpenAppointment,
  mockAthenaOpenAppointmentError,
  mockAthenaTokenFetch,
  restoreAthenaFetch,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('appointments', () => {
  let athenaApi: AthenaApi;
  let db: Db;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;

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
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  });

  afterEach(async () => {
    restoreAthenaFetch();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('starting an appointment', () => {
    describe('without a logged in user', () => {
      it('throws an error', async () => {
        const appointmentId = '12345';

        const mutation = `mutation {
          appointmentStart(input: { patientId: "${patient.id}", appointmentTypeId: 2 }) {
            athenaAppointmentId
          }
        }`;

        mockAthenaOpenAppointment({ appointmentids: { [appointmentId]: '12:20' } });
        mockAthenaBookAppointment(appointmentId, [{ appointmentid: appointmentId }]);
        mockAthenaCheckinAppointment(appointmentId, { success: 'true' });

        const result = await graphql(schema, mutation, null, {
          athenaApi, db, userRole,
        });

        expect(cloneDeep(result.errors![0].message)).toMatch(
          'not logged in',
        );
      });
    });

    describe('when an appointment can be opened, booked, and checked in', () => {
      it('returns a booked appointment', async () => {
        const appointmentId = '12345';

        const mutation = `mutation {
          appointmentStart(input: { patientId: "${patient.id}", appointmentTypeId: 2 }) {
            athenaAppointmentId
          }
        }`;

        mockAthenaOpenAppointment({ appointmentids: { [appointmentId]: '12:20' } });
        mockAthenaBookAppointment(appointmentId, [{ appointmentid: appointmentId }]);
        mockAthenaCheckinAppointment(appointmentId, { success: 'true' });

        const result = await graphql(schema, mutation, null, {
          athenaApi, db, userRole, userId: user.id,
        });

        expect(cloneDeep(result.data!.appointmentStart)).toMatchObject({
          athenaAppointmentId: appointmentId,
        });
      });
    });

    describe('when an appointment cannot be opened', () => {
      it('throws an athena response error', async () => {
        const appointmentId = '12345';

        const mutation = `mutation {
          appointmentStart(input: { patientId: "${patient.id}", appointmentTypeId: 2 }) {
            athenaAppointmentId
          }
        }`;

        mockAthenaOpenAppointmentError();
        mockAthenaBookAppointment(appointmentId, [{ appointmentid: appointmentId }]);
        mockAthenaCheckinAppointment(appointmentId, { success: 'true' });

        const result = await graphql(schema, mutation, null, {
          athenaApi, db, userRole, userId: user.id,
        });

        expect(cloneDeep(result.errors![0].message)).toMatch(
          'The data provided is invalid',
        );
      });
    });

    describe('when an appointment cannot be booked', () => {
      it('throws an athena response error', async () => {
        const appointmentId = '12345';

        const mutation = `mutation {
          appointmentStart(input: { patientId: "${patient.id}", appointmentTypeId: 2 }) {
            athenaAppointmentId
          }
        }`;

        mockAthenaOpenAppointment({ appointmentids: { [appointmentId]: '12:20' } });
        mockAthenaBookAppointmentError(appointmentId);
        mockAthenaCheckinAppointment(appointmentId, { success: 'true' });

        const result = await graphql(schema, mutation, null, {
          athenaApi, db, userRole, userId: user.id,
        });

        expect(cloneDeep(result.errors![0].message)).toMatch(
          'That appointment time was already booked or is not available for booking.',
        );
      });
    });

    describe('when an appointment cannot be checked in', () => {
      it('throws an athena resopnse error', async () => {
        const appointmentId = '12345';

        const mutation = `mutation {
          appointmentStart(input: { patientId: "${patient.id}", appointmentTypeId: 2 }) {
            athenaAppointmentId
          }
        }`;

        mockAthenaOpenAppointment({ appointmentids: { [appointmentId]: '12:20' } });
        mockAthenaBookAppointment(appointmentId, [{ appointmentid: appointmentId }]);
        mockAthenaCheckinAppointmentError(appointmentId);

        const result = await graphql(schema, mutation, null, {
          athenaApi, db, userRole, userId: user.id,
        });

        expect(cloneDeep(result.errors![0].message)).toMatch(
          'This appointment has already been checked in',
        );
      });
    });
  });

  describe('ending an appointment', () => {
    describe('when a note is provided', () => {
      describe('when the note can be created', () => {
        describe('when the appointment can be checked out', () => {
          it('returns a successful response', async () => {
            const appointmentId = '12345';

            const mutation = `mutation {
              appointmentEnd(input: {
                patientId: "${patient.id}", appointmentId: "${appointmentId}", appointmentNote: "hi"
              }) {
                success
              }
            }`;

            mockAthenaAddNoteToAppointment(appointmentId, { success: 'true' });
            mockAthenaCheckoutAppointment(appointmentId, { success: 'true' });

            const result = await graphql(schema, mutation, null, {
              athenaApi, db, userRole, userId: user.id,
            });

            expect(cloneDeep(result.data!.appointmentEnd)).toMatchObject({
              success: true,
            });
          });
        });

        describe('when the appointment cannot be checked out', () => {
          it('throws an athena response error', async () => {
            const appointmentId = '12345';

            const mutation = `mutation {
              appointmentEnd(input: {
                patientId: "${patient.id}", appointmentId: "${appointmentId}", appointmentNote: "hi"
              }) {
                success
              }
            }`;

            mockAthenaAddNoteToAppointment(appointmentId, { success: 'true' });
            mockAthenaCheckoutAppointmentError(appointmentId);

            const result = await graphql(schema, mutation, null, {
              athenaApi, db, userRole, userId: user.id,
            });

            expect(cloneDeep(result.errors![0].message)).toMatch(
              'The appointment has already been checked-out',
            );
          });
        });
      });

      describe('when the note cannot be created', () => {
        it('throws an athena response error', async () => {
          const appointmentId = '12345';

          const mutation = `mutation {
            appointmentEnd(input: {
              patientId: "${patient.id}", appointmentId: "${appointmentId}", appointmentNote: "hi"
            }) {
              success
            }
          }`;

          mockAthenaAddNoteToAppointmentError(appointmentId);
          mockAthenaCheckoutAppointment(appointmentId, { success: 'true' });

          const result = await graphql(schema, mutation, null, {
            athenaApi, db, userRole, userId: user.id,
          });

          expect(cloneDeep(result.errors![0].message)).toMatch(
            'The appointment is not available',
          );
        });
      });
    });

    describe('when a note is not provided', () => {
      describe('when the appointent can be checked out', () => {
        it('returns a successful response', async () => {
          const appointmentId = '12345';

          const mutation = `mutation {
            appointmentEnd(input: {
              patientId: "${patient.id}", appointmentId: "${appointmentId}"
            }) {
              success
            }
          }`;

          mockAthenaCheckoutAppointment(appointmentId, { success: 'true' });

          const result = await graphql(schema, mutation, null, {
            athenaApi, db, userRole, userId: user.id,
          });

          expect(cloneDeep(result.data!.appointmentEnd)).toMatchObject({
            success: true,
          });
        });
      });

      describe('when the appointment cannot be checked out', () => {
        it('throws an athena response error', async () => {
          const appointmentId = '12345';

          const mutation = `mutation {
            appointmentEnd(input: {
              patientId: "${patient.id}", appointmentId: "${appointmentId}"
            }) {
              success
            }
          }`;

          mockAthenaCheckoutAppointmentError(appointmentId);

          const result = await graphql(schema, mutation, null, {
            athenaApi, db, userRole, userId: user.id,
          });

          expect(cloneDeep(result.errors![0].message)).toMatch(
            'The appointment has already been checked-out',
          );
        });
      });
    });
  });

  describe('adding a note to an appointment', () => {
    describe('when the note is successfully added', () => {
      it('returns a successful response', async () => {
        const appointmentId = '12345';

        const mutation = `mutation {
          appointmentAddNote(input: {
            patientId: "${patient.id}", appointmentId: "${appointmentId}", appointmentNote: "note"
          }) {
            success
            appointmentNote
          }
        }`;

        mockAthenaAddNoteToAppointment(appointmentId, { success: 'true' });

        const result = await graphql(schema, mutation, null, {
          athenaApi, db, userRole, userId: user.id,
        });

        expect(cloneDeep(result.data!.appointmentAddNote)).toMatchObject({
          success: true,
          appointmentNote: 'note',
        });
      });
    });

    describe('when the note is not successfully added', () => {
      it('returns an error response', async () => {
        const appointmentId = '12345';

        const mutation = `mutation {
          appointmentAddNote(input: {
            patientId: "${patient.id}", appointmentId: "${appointmentId}", appointmentNote: "note"
          }) {
            success
          }
        }`;

        mockAthenaAddNoteToAppointmentError(appointmentId);

        const result = await graphql(schema, mutation, null, {
          athenaApi, db, userRole, userId: user.id,
        });

        expect(cloneDeep(result.errors![0].message)).toMatch(
          'The appointment is not available.',
        );
      });
    });
  });
});
