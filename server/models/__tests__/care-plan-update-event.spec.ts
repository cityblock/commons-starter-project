import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  cleanCarePlanUpdateEvents,
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import CarePlanUpdateEvent from '../care-plan-update-event';
import Clinic from '../clinic';
import Concern from '../concern';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import ProgressNote from '../progress-note';
import User from '../user';

const userRole = 'physician';

describe('care plan update event model', () => {
  let db: Db;
  let user: User;
  let patient: Patient;
  let concern: Concern;
  let patientConcern: PatientConcern;
  let patientGoal: PatientGoal;
  let clinic: Clinic;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    concern = await Concern.create({ title: 'Concern' });
    patientConcern = await PatientConcern.create({
      patientId: patient.id,
      concernId: concern.id,
      userId: user.id,
    });
    patientGoal = await PatientGoal.create({
      patientId: patient.id,
      userId: user.id,
      title: 'Patient Goal',
    });

    await cleanCarePlanUpdateEvents(patient.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and fetches a carePlanUpdateEvent', async () => {
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientConcernId: patientConcern.id,
      eventType: 'create_patient_concern',
    });
    expect(carePlanUpdateEvent.patientConcern.id).toEqual(patientConcern.id);

    const fetchedCarePlanUpdateEvent = await CarePlanUpdateEvent.get(carePlanUpdateEvent.id);
    expect(fetchedCarePlanUpdateEvent).toMatchObject({
      id: carePlanUpdateEvent.id,
      patientId: carePlanUpdateEvent.patientId,
      userId: carePlanUpdateEvent.userId,
      eventType: 'create_patient_concern',
    });
    expect(fetchedCarePlanUpdateEvent.deletedAt).toBeNull();
    expect(fetchedCarePlanUpdateEvent.createdAt).not.toBeNull();
    expect(fetchedCarePlanUpdateEvent.updatedAt).not.toBeNull();
  });

  it('does not allow creating a carePlanUpdateEvent with both concern and goal ids', async () => {
    let errorMessage: string = '';

    try {
      await CarePlanUpdateEvent.create({
        patientId: patient.id,
        userId: user.id,
        patientConcernId: patientConcern.id,
        patientGoalId: patientGoal.id,
        eventType: 'create_patient_goal',
      });
    } catch (err) {
      errorMessage = err.message;
    }

    expect(errorMessage).toMatch('violates check constraint');
  });

  it('automatically opens a progress note on create', async () => {
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientConcernId: patientConcern.id,
      eventType: 'create_patient_concern',
    });

    expect(carePlanUpdateEvent.progressNoteId).not.toBeNull();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(CarePlanUpdateEvent.get(fakeId)).rejects.toMatch(
      `No such carePlanUpdateEvent: ${fakeId}`,
    );
  });

  it('deletes a carePlanUpdateEvent', async () => {
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientConcernId: patientConcern.id,
      eventType: 'create_patient_concern',
    });
    const fetchedCarePlanUpdateEvent = await CarePlanUpdateEvent.get(carePlanUpdateEvent.id);
    expect(fetchedCarePlanUpdateEvent.deletedAt).toBeNull();

    await CarePlanUpdateEvent.delete(carePlanUpdateEvent.id);
    await expect(CarePlanUpdateEvent.get(carePlanUpdateEvent.id)).rejects.toMatch(
      `No such carePlanUpdateEvent: ${carePlanUpdateEvent.id}`,
    );
  });

  it('fetches all not deleted care plan update events for a patient concern', async () => {
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientConcernId: patientConcern.id,
      eventType: 'create_patient_concern',
    });
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientConcernId: patientConcern.id,
      eventType: 'edit_patient_concern',
    });

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatientConcern(
      patientConcern.id,
      { pageNumber: 0, pageSize: 10 },
    );
    expect(fetchedCarePlanUpdateEvents).toMatchObject({
      results: [
        {
          id: carePlanUpdateEventToBeDeleted.id,
        },
        {
          id: carePlanUpdateEvent.id,
        },
      ],
      total: 2,
    });

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatientConcern(
      patientConcern.id,
      { pageNumber: 0, pageSize: 10 },
    );
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject({
      results: [{ id: carePlanUpdateEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted care plan update events for a patient goal', async () => {
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientGoalId: patientGoal.id,
      eventType: 'create_patient_goal',
    });
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientGoalId: patientGoal.id,
      eventType: 'edit_patient_goal',
    });

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatientGoal(
      patientGoal.id,
      { pageNumber: 0, pageSize: 10 },
    );
    expect(fetchedCarePlanUpdateEvents).toMatchObject({
      results: [
        {
          id: carePlanUpdateEventToBeDeleted.id,
        },
        {
          id: carePlanUpdateEvent.id,
        },
      ],
      total: 2,
    });

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatientGoal(
      patientGoal.id,
      { pageNumber: 0, pageSize: 10 },
    );
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject({
      results: [{ id: carePlanUpdateEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted care plan update events for a patient', async () => {
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientGoalId: patientGoal.id,
      eventType: 'create_patient_goal',
    });
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientConcernId: patientConcern.id,
      eventType: 'edit_patient_concern',
    });

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(fetchedCarePlanUpdateEvents).toMatchObject({
      results: [
        {
          id: carePlanUpdateEventToBeDeleted.id,
        },
        {
          id: carePlanUpdateEvent.id,
        },
      ],
      total: 2,
    });

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
      patient.id,
      { pageNumber: 0, pageSize: 10 },
    );
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject({
      results: [{ id: carePlanUpdateEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted care plan update events for a user', async () => {
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientGoalId: patientGoal.id,
      eventType: 'create_patient_goal',
    });
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientConcernId: patientConcern.id,
      eventType: 'edit_patient_concern',
    });

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForUser(user.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(fetchedCarePlanUpdateEvents).toMatchObject({
      results: [
        {
          id: carePlanUpdateEventToBeDeleted.id,
        },
        {
          id: carePlanUpdateEvent.id,
        },
      ],
      total: 2,
    });

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForUser(user.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject({
      results: [{ id: carePlanUpdateEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted care plan update events for a progress note', async () => {
    const progressNote = await ProgressNote.autoOpenIfRequired({
      patientId: patient.id,
      userId: user.id,
    });
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientGoalId: patientGoal.id,
      eventType: 'create_patient_goal',
      progressNoteId: progressNote.id,
    });
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientGoalId: patientGoal.id,
      eventType: 'edit_patient_goal',
      progressNoteId: progressNote.id,
    });

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForProgressNote(
      progressNote.id,
    );
    const fetchedCarePlanUpdateEventIds = fetchedCarePlanUpdateEvents.map(event => event.id);
    expect(fetchedCarePlanUpdateEventIds).toContain(carePlanUpdateEvent.id);
    expect(fetchedCarePlanUpdateEventIds).toContain(carePlanUpdateEventToBeDeleted.id);

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForProgressNote(
      progressNote.id,
    );
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject([{ id: carePlanUpdateEvent.id }]);
  });
});
