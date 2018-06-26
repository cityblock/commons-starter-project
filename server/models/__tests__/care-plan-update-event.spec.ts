import { transaction, Transaction } from 'objection';
import { CarePlanUpdateEventTypes, UserRole } from 'schema';
import uuid from 'uuid/v4';
import {
  cleanCarePlanUpdateEvents,
  createMockClinic,
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

interface ISetup {
  user: User;
  patient: Patient;
  concern: Concern;
  patientConcern: PatientConcern;
  patientGoal: PatientGoal;
  clinic: Clinic;
}

const userRole = 'Pharmacist' as UserRole;

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const concern = await Concern.create({ title: 'Concern' }, txn);
  const patientConcern = await PatientConcern.create(
    {
      patientId: patient.id,
      concernId: concern.id,
      userId: user.id,
    },
    txn,
  );
  const patientGoal = await PatientGoal.create(
    {
      patientId: patient.id,
      userId: user.id,
      title: 'Patient Goal',
      patientConcernId: patientConcern.id,
    },
    txn,
  );

  await cleanCarePlanUpdateEvents(patient.id, txn);

  return {
    clinic,
    user,
    patient,
    concern,
    patientConcern,
    patientGoal,
  };
}

describe('care plan update event model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(CarePlanUpdateEvent.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('creates and fetches a carePlanUpdateEvent', async () => {
    const { patient, user, patientConcern } = await setup(txn);
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientConcernId: patientConcern.id,
        eventType: 'create_patient_concern' as CarePlanUpdateEventTypes,
      },
      txn,
    );
    expect(carePlanUpdateEvent.patientConcern.id).toEqual(patientConcern.id);

    const fetchedCarePlanUpdateEvent = await CarePlanUpdateEvent.get(carePlanUpdateEvent.id, txn);
    expect(fetchedCarePlanUpdateEvent).toMatchObject({
      id: carePlanUpdateEvent.id,
      patientId: carePlanUpdateEvent.patientId,
      userId: carePlanUpdateEvent.userId,
      eventType: 'create_patient_concern',
    });
    expect(fetchedCarePlanUpdateEvent.deletedAt).toBeFalsy();
    expect(fetchedCarePlanUpdateEvent.createdAt).not.toBeFalsy();
    expect(fetchedCarePlanUpdateEvent.updatedAt).not.toBeFalsy();
  });

  it('does not allow creating a carePlanUpdateEvent with both concern and goal ids', async () => {
    const { patient, user, patientConcern, patientGoal } = await setup(txn);
    let errorMessage: string = '';

    try {
      await CarePlanUpdateEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientConcernId: patientConcern.id,
          patientGoalId: patientGoal.id,
          eventType: 'create_patient_goal' as CarePlanUpdateEventTypes,
        },
        txn,
      );
    } catch (err) {
      errorMessage = err.message;
    }

    expect(errorMessage).toMatch('violates check constraint');
  });

  it('automatically opens a progress note on create', async () => {
    const { patient, user, patientConcern } = await setup(txn);
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientConcernId: patientConcern.id,
        eventType: 'create_patient_concern' as CarePlanUpdateEventTypes,
      },
      txn,
    );

    expect(carePlanUpdateEvent.progressNoteId).not.toBeFalsy();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(CarePlanUpdateEvent.get(fakeId, txn)).rejects.toMatch(
      `No such carePlanUpdateEvent: ${fakeId}`,
    );
  });

  it('deletes a carePlanUpdateEvent', async () => {
    const { patient, user, patientConcern } = await setup(txn);
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientConcernId: patientConcern.id,
        eventType: 'create_patient_concern' as CarePlanUpdateEventTypes,
      },
      txn,
    );
    const fetchedCarePlanUpdateEvent = await CarePlanUpdateEvent.get(carePlanUpdateEvent.id, txn);
    expect(fetchedCarePlanUpdateEvent.deletedAt).toBeFalsy();

    await CarePlanUpdateEvent.delete(carePlanUpdateEvent.id, txn);
    await expect(CarePlanUpdateEvent.get(carePlanUpdateEvent.id, txn)).rejects.toMatch(
      `No such carePlanUpdateEvent: ${carePlanUpdateEvent.id}`,
    );
  });

  it('fetches all not deleted care plan update events for a patient concern', async () => {
    const { patient, user, patientConcern } = await setup(txn);
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientConcernId: patientConcern.id,
        eventType: 'create_patient_concern' as CarePlanUpdateEventTypes,
      },
      txn,
    );
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientConcernId: patientConcern.id,
        eventType: 'edit_patient_concern' as CarePlanUpdateEventTypes,
      },
      txn,
    );

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatientConcern(
      patientConcern.id,
      { pageNumber: 0, pageSize: 10 },
      txn,
    );
    const carePlanUpdateEventIds = fetchedCarePlanUpdateEvents.results.map(event => event.id);
    expect(carePlanUpdateEventIds).toContain(carePlanUpdateEventToBeDeleted.id);
    expect(carePlanUpdateEventIds).toContain(carePlanUpdateEvent.id);
    expect(fetchedCarePlanUpdateEvents.total).toEqual(2);

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id, txn);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatientConcern(
      patientConcern.id,
      { pageNumber: 0, pageSize: 10 },
      txn,
    );
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject({
      results: [{ id: carePlanUpdateEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted care plan update events for a patient goal', async () => {
    const { patient, user, patientGoal } = await setup(txn);
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientGoalId: patientGoal.id,
        eventType: 'create_patient_goal' as CarePlanUpdateEventTypes,
      },
      txn,
    );
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientGoalId: patientGoal.id,
        eventType: 'edit_patient_goal' as CarePlanUpdateEventTypes,
      },
      txn,
    );

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatientGoal(
      patientGoal.id,
      { pageNumber: 0, pageSize: 10 },
      txn,
    );
    const carePlanUpdateEventIds = fetchedCarePlanUpdateEvents.results.map(event => event.id);
    expect(carePlanUpdateEventIds).toContain(carePlanUpdateEvent.id);
    expect(carePlanUpdateEventIds).toContain(carePlanUpdateEventToBeDeleted.id);
    expect(fetchedCarePlanUpdateEvents.total).toEqual(2);

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id, txn);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatientGoal(
      patientGoal.id,
      { pageNumber: 0, pageSize: 10 },
      txn,
    );
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject({
      results: [{ id: carePlanUpdateEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted care plan update events for a patient', async () => {
    const { patient, user, patientGoal, patientConcern } = await setup(txn);
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientGoalId: patientGoal.id,
        eventType: 'create_patient_goal' as CarePlanUpdateEventTypes,
      },
      txn,
    );
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientConcernId: patientConcern.id,
        eventType: 'edit_patient_concern' as CarePlanUpdateEventTypes,
      },
      txn,
    );

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );
    const carePlanUpdateEventIds = fetchedCarePlanUpdateEvents.results.map(event => event.id);
    expect(carePlanUpdateEventIds).toContain(carePlanUpdateEvent.id);
    expect(carePlanUpdateEventIds).toContain(carePlanUpdateEventToBeDeleted.id);
    expect(fetchedCarePlanUpdateEvents.total).toEqual(2);

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id, txn);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
      patient.id,
      { pageNumber: 0, pageSize: 10 },
      txn,
    );
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject({
      results: [{ id: carePlanUpdateEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted care plan update events for a user', async () => {
    const { patient, user, patientGoal, patientConcern } = await setup(txn);
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientGoalId: patientGoal.id,
        eventType: 'create_patient_goal' as CarePlanUpdateEventTypes,
      },
      txn,
    );
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientConcernId: patientConcern.id,
        eventType: 'edit_patient_concern' as CarePlanUpdateEventTypes,
      },
      txn,
    );

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForUser(
      user.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );
    const carePlanUpdateEventIds = fetchedCarePlanUpdateEvents.results.map(event => event.id);
    expect(carePlanUpdateEventIds).toContain(carePlanUpdateEvent.id);
    expect(carePlanUpdateEventIds).toContain(carePlanUpdateEventToBeDeleted.id);
    expect(fetchedCarePlanUpdateEvents.total).toEqual(2);

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id, txn);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForUser(
      user.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject({
      results: [{ id: carePlanUpdateEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted care plan update events for a progress note', async () => {
    const { patient, user, patientGoal } = await setup(txn);
    const progressNote = await ProgressNote.autoOpenIfRequired(
      {
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientGoalId: patientGoal.id,
        eventType: 'create_patient_goal' as CarePlanUpdateEventTypes,
        progressNoteId: progressNote.id,
      },
      txn,
    );
    const carePlanUpdateEventToBeDeleted = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientGoalId: patientGoal.id,
        eventType: 'edit_patient_goal' as CarePlanUpdateEventTypes,
        progressNoteId: progressNote.id,
      },
      txn,
    );

    // Make sure all carePlanUpdateEvents are returned
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForProgressNote(
      progressNote.id,
      txn,
    );
    const fetchedCarePlanUpdateEventIds = fetchedCarePlanUpdateEvents.map(event => event.id);
    expect(fetchedCarePlanUpdateEventIds).toContain(carePlanUpdateEvent.id);
    expect(fetchedCarePlanUpdateEventIds).toContain(carePlanUpdateEventToBeDeleted.id);

    await CarePlanUpdateEvent.delete(carePlanUpdateEventToBeDeleted.id, txn);

    // Make sure the deleted carePlanUpdateEvent isn't returned
    const secondFetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForProgressNote(
      progressNote.id,
      txn,
    );
    expect(secondFetchedCarePlanUpdateEvents).toMatchObject([{ id: carePlanUpdateEvent.id }]);
  });
});
