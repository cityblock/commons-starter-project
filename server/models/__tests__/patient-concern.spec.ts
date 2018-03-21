import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import CarePlanUpdateEvent from '../care-plan-update-event';
import Clinic from '../clinic';
import Concern from '../concern';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import Task from '../task';
import User from '../user';

interface ISetup {
  concern: Concern;
  concern2: Concern;
  patient: Patient;
  user: User;
  clinic: Clinic;
}

const userRole = 'physician';

async function setup(txn: Transaction): Promise<ISetup> {
  const concern = await Concern.create(
    {
      title: 'Housing',
    },
    txn,
  );
  const concern2 = await Concern.create(
    {
      title: 'Food',
    },
    txn,
  );
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return {
    concern,
    concern2,
    clinic,
    user,
    patient,
  };
}

describe('patient concern model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PatientConcern.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get a patient concern', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    expect(patientConcern.order).toEqual(2); // Admin Tasks concern already exists
    expect(await PatientConcern.get(patientConcern.id, txn)).toEqual(patientConcern);

    // cannot add the same concern 2x
    await expect(
      PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      ),
    ).rejects.toMatchObject(
      new Error(
        'insert into "patient_concern" ("concernId", "createdAt", "id", "order", "patientId", "updatedAt") values ($1, $2, $3, (select coalesce(max("order"), 0) + 1 from "patient_concern" where "patientId" = $4 and "deletedAt" is null), $5, $6) returning "id" - duplicate key value violates unique constraint "patientconcern_patientid_deletedat"',
      ),
    );
  });

  it('creates the correct CarePlanUpdateEvent when creating a patient concern', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );

    expect(fetchedCarePlanUpdateEvents.total).toEqual(1);
    expect(fetchedCarePlanUpdateEvents.results[0].patientConcernId).toEqual(patientConcern.id);
    expect(fetchedCarePlanUpdateEvents.results[0].eventType).toEqual('create_patient_concern');
  });

  it('gets a concern and associated goals/tasks', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const patientGoal = await PatientGoal.create(
      {
        title: 'Goal Title',
        patientConcernId: patientConcern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const incompleteTask = await Task.create(
      {
        title: 'Incomplete Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    const completeTask = await Task.create(
      {
        title: 'Complete Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );

    await Task.complete(completeTask.id, user.id, txn);

    const fetchedConcern = await PatientConcern.get(patientConcern.id, txn);
    const fetchedPatientGoal = fetchedConcern.patientGoals[0];
    const { tasks } = fetchedPatientGoal;
    const taskIds = tasks.map(task => task.id);
    expect(fetchedPatientGoal.id).toEqual(patientGoal.id);
    expect(taskIds).toContain(incompleteTask.id);
    expect(taskIds).not.toContain(completeTask.id);
  });

  it('gets concerns associated with a patient', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const fetchedConcerns = await PatientConcern.getForPatient(patient.id, txn);
    expect(fetchedConcerns.length).toEqual(2);
    expect(fetchedConcerns[1]).toMatchObject(patientConcern);
  });

  it('gets concerns associated with a patient and loads correct goals/tasks', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const patientGoal = await PatientGoal.create(
      {
        title: 'Goal Title',
        patientConcernId: patientConcern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const incompleteTask = await Task.create(
      {
        title: 'Incomplete Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    const completeTask = await Task.create(
      {
        title: 'Complete Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    const deletedTask = await Task.create(
      {
        title: 'Deleted Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    await Task.delete(deletedTask.id, txn);

    await Task.complete(completeTask.id, user.id, txn);

    const fetchedConcerns = await PatientConcern.getForPatient(patient.id, txn);
    const fetchedPatientGoal = fetchedConcerns[1].patientGoals[0];
    const { tasks } = fetchedPatientGoal;
    const taskIds = tasks.map(task => task.id);
    expect(fetchedPatientGoal.id).toEqual(patientGoal.id);
    expect(taskIds).toContain(incompleteTask.id);
    expect(taskIds).not.toContain(completeTask.id);
  });

  it('auto increments "order" on create', async () => {
    const { clinic, user, concern, concern2, patient } = await setup(txn);
    const patient2 = await createPatient({ cityblockId: 456, homeClinicId: clinic.id }, txn);
    await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    await PatientConcern.create(
      {
        concernId: concern2.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient2.id,
        userId: user.id,
      },
      txn,
    );

    const patient1Concerns = await PatientConcern.getForPatient(patient.id, txn);
    const patient2Concerns = await PatientConcern.getForPatient(patient2.id, txn);

    expect(patient1Concerns.length).toEqual(3);
    expect(patient1Concerns[1].order).toEqual(2);
    expect(patient1Concerns[2].order).toEqual(3);

    expect(patient2Concerns.length).toEqual(2);
    expect(patient2Concerns[1].order).toEqual(2);
  });

  it('should throw an error if a patient concern does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(PatientConcern.get(fakeId, txn)).rejects.toMatch(
      `No such patient concern: ${fakeId}`,
    );
  });

  it('edits patient concern', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const completedAt = new Date().toISOString();
    const patientConcernUpdated = await PatientConcern.update(
      patientConcern.id,
      {
        completedAt,
      },
      user.id,
      txn,
    );
    expect(patientConcernUpdated.completedAt).not.toBeFalsy();
  });

  it('creates the correct CarePlanUpdateEvent when editing a patient concern', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const completedAt = new Date().toISOString();
    await PatientConcern.update(
      patientConcern.id,
      {
        completedAt,
      },
      user.id,
      txn,
    );
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );

    expect(fetchedCarePlanUpdateEvents.total).toEqual(2); // One for create and one for edit
    const eventTypes = fetchedCarePlanUpdateEvents.results.map(event => event.eventType);
    expect(eventTypes).toContain('create_patient_concern');
    expect(eventTypes).toContain('edit_patient_concern');
  });

  it('bulk updates patient concerns order', async () => {
    const { concern, patient, user, concern2 } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const patientConcern2 = await PatientConcern.create(
      {
        concernId: concern2.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const patientConcernUpdateData = [
      {
        id: patientConcern.id,
        order: 3,
      },
      {
        id: patientConcern2.id,
        order: 2,
      },
    ];

    const patientConcerns = await PatientConcern.bulkUpdate(
      patientConcernUpdateData,
      patient.id,
      txn,
    );

    expect(patientConcerns.length).toBe(3);

    expect(patientConcerns[1]).toMatchObject({
      id: patientConcern2.id,
      order: 2,
      concernId: concern2.id,
    });
    expect(patientConcerns[2]).toMatchObject({
      id: patientConcern.id,
      order: 3,
      concernId: concern.id,
    });
  });

  it('bulk updates patient concerns started and completed at', async () => {
    const { concern, patient, user, concern2 } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
        startedAt: new Date().toISOString(),
        order: 2,
      },
      txn,
    );

    const patientConcern2 = await PatientConcern.create(
      {
        concernId: concern2.id,
        patientId: patient.id,
        userId: user.id,
        order: 3,
      },
      txn,
    );

    const completedAt = new Date().toISOString();
    const patientConcernUpdateData = [
      {
        id: patientConcern.id,
        startedAt: null,
        order: 3,
      },
      {
        id: patientConcern2.id,
        completedAt,
        order: 2,
      },
    ];

    const patientConcerns = await PatientConcern.bulkUpdate(
      patientConcernUpdateData,
      patient.id,
      txn,
    );

    expect(patientConcerns.length).toBe(3);
    expect(patientConcerns[1]).toMatchObject({
      id: patientConcern2.id,
      order: 2,
      concernId: concern2.id,
    });
    expect(patientConcerns[1].completedAt).toBeTruthy();
    expect(patientConcerns[2]).toMatchObject({
      id: patientConcern.id,
      order: 3,
      concernId: concern.id,
      startedAt: null,
      completedAt: null,
    });
  });

  it('bulk updates without changing unaffected concerns', async () => {
    const { concern, patient, user, concern2 } = await setup(txn);
    const patientConcern1 = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const patientConcern2 = await PatientConcern.create(
      {
        concernId: concern2.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const patientConcernUpdateData = [
      {
        id: patientConcern1.id,
        order: 2,
      },
    ];

    await PatientConcern.bulkUpdate(patientConcernUpdateData, patient.id, txn);

    const fetchedPatientConcern2 = await PatientConcern.get(patientConcern2.id, txn);
    expect(fetchedPatientConcern2).toEqual(patientConcern2);
  });

  it('deletes patient concern', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const deletedPatientConcern = await PatientConcern.delete(patientConcern.id, user.id, txn);
    expect(deletedPatientConcern).not.toBeFalsy();

    // Can re-add patient concern
    const patientConcern2 = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    expect(patientConcern2).not.toBeNull();
  });

  it('creates the correct CarePlanUpdateEvent when deleting a patient concern', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    await PatientConcern.delete(patientConcern.id, user.id, txn);
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );

    const eventTypes = fetchedCarePlanUpdateEvents.results.map(event => event.eventType);
    expect(eventTypes).toContain('create_patient_concern');
    expect(eventTypes).toContain('delete_patient_concern');
    expect(fetchedCarePlanUpdateEvents.total).toEqual(2); // One for create and one for delete
  });

  it('gets associted patient id for a patient concern', async () => {
    const { concern, patient, user } = await setup(txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const fetchedPatientId = await PatientConcern.getPatientIdForResource(patientConcern.id, txn);

    expect(fetchedPatientId).toBe(patient.id);
  });
});
