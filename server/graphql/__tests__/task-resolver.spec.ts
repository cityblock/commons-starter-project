import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import * as getTasksForPatient from '../../../app/graphql/queries/get-patient-tasks.graphql';
import * as taskIdsWithNotifications from '../../../app/graphql/queries/get-task-ids-with-notifications.graphql';
import * as getTask from '../../../app/graphql/queries/get-task.graphql';
import * as tasksDueSoonForPatient from '../../../app/graphql/queries/get-tasks-due-soon-for-patient.graphql';
import * as tasksForCurrentUserPatient from '../../../app/graphql/queries/get-tasks-for-user-for-patient.graphql';
import * as tasksWithNotificationsForPatient from '../../../app/graphql/queries/get-tasks-with-notifications-for-patient.graphql';
import * as taskComplete from '../../../app/graphql/queries/task-complete-mutation.graphql';
import * as taskCreate from '../../../app/graphql/queries/task-create-mutation.graphql';
import * as taskDelete from '../../../app/graphql/queries/task-delete-mutation.graphql';
import * as taskEdit from '../../../app/graphql/queries/task-edit-mutation.graphql';
import * as taskUncomplete from '../../../app/graphql/queries/task-uncomplete-mutation.graphql';
import * as tasksForCurrentUser from '../../../app/graphql/queries/tasks-for-current-user.graphql';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import TaskFollower from '../../models/task-follower';
import User from '../../models/user';
import {
  createCBOReferral,
  createMockClinic,
  createMockUser,
  createPatient,
  setupUrgentTasks,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  task1: Task;
  task2: Task;
  user: User;
  user2: User;
  patient: Patient;
  clinic: Clinic;
  patientGoal: PatientGoal;
}

const userRole = 'physician';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
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
      patientId: patient.id,
      title: 'goal title',
      userId: user.id,
      patientConcernId: patientConcern.id,
    },
    txn,
  );
  const dueAt = new Date().toISOString();
  const dueAt2 = new Date();
  dueAt2.setDate(dueAt2.getDate() + 2);

  const task1 = await Task.create(
    {
      title: 'Task 1 Title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'low',
      patientGoalId: patientGoal.id,
    },
    txn,
  );
  const task2 = await Task.create(
    {
      title: 'Task 2 Title',
      description: 'description',
      dueAt: dueAt2.toISOString(),
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    },
    txn,
  );

  return {
    clinic,
    user,
    user2,
    patient,
    task1,
    task2,
    patientGoal,
  };
}

describe('task tests', () => {
  let db: Db;
  let txn = null as any;
  const tasksWithNotificationsForPatientQuery = print(tasksWithNotificationsForPatient);
  const tasksDueSoonForPatientQuery = print(tasksDueSoonForPatient);
  const taskIdsWithNotificationsQuery = print(taskIdsWithNotifications);
  const taskDeleteMutation = print(taskDelete);
  const tasksForCurrentUserPatientQuery = print(tasksForCurrentUserPatient);
  const tasksForCurrentUserQuery = print(tasksForCurrentUser);
  const getTaskQuery = print(getTask);
  const getTasksForPatientQuery = print(getTasksForPatient);
  const taskEditMutation = print(taskEdit);
  const taskCreateMutation = print(taskCreate);
  const taskCompleteMutation = print(taskComplete);
  const taskUncompleteMutation = print(taskUncomplete);

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve task', () => {
    it('can fetch task', async () => {
      const { task1, user, patient } = await setup(txn);
      const result = await graphql(
        schema,
        getTaskQuery,
        null,
        {
          db,
          userId: user.id,
          permissions,
          txn,
        },
        { taskId: task1.id },
      );
      expect(cloneDeep(result.data!.task)).toMatchObject({
        id: task1.id,
        title: 'Task 1 Title',
        description: 'description',
        createdBy: { id: user.id },
        assignedTo: { id: user.id },
        patient: { id: patient.id },
      });
    });

    it('errors if a task cannot be found', async () => {
      const { user } = await setup(txn);
      const fakeId = uuid();
      const result = await graphql(
        schema,
        getTaskQuery,
        null,
        {
          db,
          userId: user.id,
          permissions,
          txn,
        },
        { taskId: fakeId },
      );
      expect(result.errors![0].message).toMatch(`No such task: ${fakeId}`);
    });
  });

  describe('resolve patient tasks', () => {
    it('resolves patient tasks', async () => {
      const { patient, task1, user } = await setup(txn);
      const result = await graphql(
        schema,
        getTasksForPatientQuery,
        null,
        {
          db,
          userId: user.id,
          permissions,
          txn,
        },
        { patientId: patient.id, pageNumber: 0, pageSize: 1 },
      );

      expect(cloneDeep(result.data!.tasksForPatient)).toMatchObject({
        edges: [
          {
            node: {
              id: task1.id,
              title: task1.title,
            },
          },
        ],
      });
    });

    it('returns correct page information', async () => {
      const { patient, task1, user } = await setup(txn);
      const result = await graphql(
        schema,
        getTasksForPatientQuery,
        null,
        {
          db,
          userId: user.id,
          permissions,
          txn,
        },
        { patientId: patient.id, pageNumber: 0, pageSize: 1, orderBy: 'titleAsc' },
      );

      expect(cloneDeep(result.data!.tasksForPatient)).toMatchObject({
        edges: [
          {
            node: {
              id: task1.id,
              title: task1.title,
            },
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });

    it('can alter sort order', async () => {
      const { patient, task2, user } = await setup(txn);
      const result = await graphql(
        schema,
        getTasksForPatientQuery,
        null,
        {
          db,
          userId: user.id,
          permissions,
          txn,
        },
        { patientId: patient.id, pageNumber: 0, pageSize: 1, orderBy: 'createdAtDesc' },
      );
      expect(cloneDeep(result.data!.tasksForPatient)).toMatchObject({
        edges: [
          {
            node: {
              id: task2.id,
              title: task2.title,
            },
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });
  });

  describe('taskEdit', () => {
    it('edits task', async () => {
      const { task1, user } = await setup(txn);
      const result = await graphql(
        schema,
        taskEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { title: 'new title', taskId: task1.id },
      );
      expect(cloneDeep(result.data!.taskEdit)).toMatchObject({
        title: 'new title',
      });
    });

    it('creates the relevant TaskEvent records', async () => {
      const { task1, user, user2 } = await setup(txn);
      // Editing one field at a time
      const result = await graphql(
        schema,
        taskEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { priority: 'high', taskId: task1.id },
      );
      const task = cloneDeep(result.data!.taskEdit);
      const taskEvents = await TaskEvent.getTaskEvents(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents.total).toEqual(1);
      expect(taskEvents.results[0].eventType).toEqual('edit_priority');

      const result2 = await graphql(
        schema,
        taskEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { assignedToId: user2.id, taskId: task1.id },
      );
      const secondTask = cloneDeep(result2.data!.taskEdit);
      const taskEvents2 = await TaskEvent.getTaskEvents(
        secondTask.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents2.total).toEqual(2);
      expect(taskEvents2.results.map(taskEvent => taskEvent.eventType)).toContain('edit_assignee');

      const newDueAt = new Date().toISOString();
      const result3 = await graphql(
        schema,
        taskEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { dueAt: newDueAt, taskId: task1.id },
      );
      const thirdTask = cloneDeep(result3.data!.taskEdit);
      const taskEvents3 = await TaskEvent.getTaskEvents(
        thirdTask.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents3.total).toEqual(3);
      expect(taskEvents3.results.map(taskEvent => taskEvent.eventType)).toContain('edit_due_date');

      const result4 = await graphql(
        schema,
        taskEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { title: 'edited title', taskId: task1.id },
      );
      const fourthTask = cloneDeep(result4.data!.taskEdit);
      const taskEvents4 = await TaskEvent.getTaskEvents(
        fourthTask.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents4.total).toEqual(4);
      expect(taskEvents4.results.map(taskEvent => taskEvent.eventType)).toContain('edit_title');

      const result5 = await graphql(
        schema,
        taskEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { description: 'edited description', taskId: task1.id },
      );
      const fifthTask = cloneDeep(result5.data!.taskEdit);
      const taskEvents5 = await TaskEvent.getTaskEvents(
        fifthTask.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents5.total).toEqual(5);
      expect(taskEvents5.results.map(taskEvent => taskEvent.eventType)).toContain(
        'edit_description',
      );

      // Editing multiple fields at the same time
      const result6 = await graphql(
        schema,
        taskEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        {
          dueAt: newDueAt,
          assignedToId: user.id,
          priority: 'medium',
          taskId: task1.id,
          title: 'brand new title',
          description: 'fancy new description',
        },
      );
      const sixthTask = cloneDeep(result6.data!.taskEdit);
      const taskEvents6 = await TaskEvent.getTaskEvents(
        sixthTask.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents6.total).toEqual(10);
    });
  });

  describe('taskComplete', () => {
    it('completes a task', async () => {
      const { task1, user } = await setup(txn);
      expect(task1.completedAt).toBeFalsy();
      const result = await graphql(
        schema,
        taskCompleteMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { taskId: task1.id },
      );
      expect(result.data!.taskComplete.completedAt).not.toBeFalsy();
    });

    it('creates the relevant TaskEvent model', async () => {
      const { task1, user } = await setup(txn);
      await graphql(
        schema,
        taskCompleteMutation,
        null,
        { db, permissions, userId: user.id, txn },
        { taskId: task1.id },
      );
      const taskEvents = await TaskEvent.getTaskEvents(
        task1.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents.total).toEqual(1);
      expect(taskEvents.results[0].eventType).toEqual('complete_task');
    });
  });

  describe('taskUncomplete', () => {
    it('uncompletes a task', async () => {
      const { task1, user } = await setup(txn);
      await Task.complete(task1.id, user.id, txn);
      const result = await graphql(
        schema,
        taskUncompleteMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { taskId: task1.id },
      );
      expect(result.data!.taskUncomplete.completedAt).toBeFalsy();
    });

    it('creates the relevant TaskEvent model', async () => {
      const { task1, user } = await setup(txn);
      await graphql(
        schema,
        taskUncompleteMutation,
        null,
        { db, permissions, userId: user.id, txn },
        { taskId: task1.id },
      );
      const taskEvents = await TaskEvent.getTaskEvents(
        task1.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents.total).toEqual(1);
      expect(taskEvents.results[0].eventType).toEqual('uncomplete_task');
    });
  });

  describe('taskCreate', () => {
    it('creates a new task', async () => {
      const { patient, user, patientGoal } = await setup(txn);
      const title = 'new title';
      const result = await graphql(
        schema,
        taskCreateMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { patientId: patient.id, title, description: 'description', patientGoalId: patientGoal.id },
      );
      expect(cloneDeep(result.data!.taskCreate.title)).toEqual(title);
    });

    it('creates a new task with CBO referral', async () => {
      const title = 'Defeat Night King';
      const description = 'description';
      const { patient, user, patientGoal } = await setup(txn);
      const cboReferral = await createCBOReferral(txn);

      const result = await graphql(
        schema,
        taskCreateMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        {
          patientId: patient.id,
          title,
          CBOReferralId: cboReferral.id,
          patientGoalId: patientGoal.id,
          description,
        },
      );
      expect(result.data!.taskCreate.CBOReferralId).toEqual(cboReferral.id);
    });

    it('creates the relevant TaskEvent records', async () => {
      const { patient, user, patientGoal } = await setup(txn);
      const result = await graphql(
        schema,
        taskCreateMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        {
          patientId: patient.id,
          title: 'title',
          description: 'description',
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
      );
      const task = cloneDeep(result.data!.taskCreate);
      expect(task).toMatchObject({
        title: 'title',
      });

      const taskEvents = await TaskEvent.getTaskEvents(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents.total).toEqual(2);
      const expectedEventTypes = taskEvents.results.map(taskEvent => taskEvent.eventType);
      expect(expectedEventTypes).toEqual(expect.arrayContaining(['edit_assignee', 'create_task']));
    });
  });

  describe('taskDelete', () => {
    it('marks a task as deleted', async () => {
      const { patient, task1, user } = await setup(txn);
      const beforeDeletePatientTasks = await Task.getPatientTasks(
        patient.id,
        {
          pageNumber: 0,
          pageSize: 10,
          orderBy: 'createdAt',
          order: 'desc',
        },
        txn,
      );

      expect(beforeDeletePatientTasks.results.map(task => task.id)).toContain(task1.id);

      const result = await graphql(
        schema,
        taskDeleteMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { taskId: task1.id },
      );
      expect(cloneDeep(result.data!.taskDelete)).toMatchObject({
        id: task1.id,
      });

      const afterDeletePatientTasks = await Task.getPatientTasks(
        patient.id,
        {
          pageNumber: 0,
          pageSize: 10,
          orderBy: 'createdAt',
          order: 'desc',
        },
        txn,
      );

      expect(afterDeletePatientTasks.results.map(task => task.id)).not.toContain(task1.id);
    });

    it('creates the relevant TaskEvent records', async () => {
      const { task1, user } = await setup(txn);
      const result = await graphql(
        schema,
        taskDeleteMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { taskId: task1.id },
      );
      const task = cloneDeep(result.data!.taskDelete);
      expect(task).toMatchObject({ id: task1.id });

      const taskEvents = await TaskEvent.getTaskEvents(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents.total).toEqual(1);
      expect(taskEvents.results[0].eventType).toEqual('delete_task');
    });
  });

  describe('tasksDueSoonForPatient', () => {
    it('retrieves a list of tasks due soon for a patient and user', async () => {
      const { patient1, user, task1 } = await setupUrgentTasks(txn);

      const result = await graphql(
        schema,
        tasksDueSoonForPatientQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { patientId: patient1.id },
      );

      expect(result.data!.tasksDueSoonForPatient.length).toBe(1);
      expect(result.data!.tasksDueSoonForPatient[0].id).toBe(task1.id);
    });
  });

  describe('tasksWithNotificationsForPatient', () => {
    it('retrieves a list of tasks due soon for a patient and user', async () => {
      const { patient5, user, task } = await setupUrgentTasks(txn);

      const result = await graphql(
        schema,
        tasksWithNotificationsForPatientQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { patientId: patient5.id },
      );

      expect(result.data!.tasksWithNotificationsForPatient.length).toBe(1);
      expect(result.data!.tasksWithNotificationsForPatient[0].id).toBe(task.id);
    });
  });

  describe('taskIdsWithNotifications', () => {
    it('retrieves a list of task ids that have notifications for the current user', async () => {
      const { user, task } = await setupUrgentTasks(txn);

      const result = await graphql(schema, taskIdsWithNotificationsQuery, null, {
        permissions,
        userId: user.id,
        txn,
      });

      expect(result.data!.taskIdsWithNotifications.length).toBe(1);
      expect(result.data!.taskIdsWithNotifications[0].id).toBe(task.id);
    });
  });

  describe('tasksForUserForPatient', () => {
    it('retrieves a list of tasks assigned to or followed by a user for a patient', async () => {
      const { user, user2, task1, task2, patient, patientGoal } = await setup(txn);
      const followedTask = await Task.create(
        {
          title: 'Task 1 Title',
          description: 'description',
          dueAt: new Date().toISOString(),
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user2.id,
          priority: 'low',
          patientGoalId: patientGoal.id,
        },
        txn,
      );
      await TaskFollower.followTask({ userId: user.id, taskId: followedTask.id }, txn);

      const result = await graphql(
        schema,
        tasksForCurrentUserPatientQuery,
        null,
        {
          permissions,
          userId: user2.id,
          txn,
        },
        { patientId: patient.id, userId: user.id },
      );
      const taskIds = result.data!.tasksForUserForPatient.map((task: Task) => task.id);

      expect(taskIds).toContain(task1.id);
      expect(taskIds).toContain(task2.id);
      expect(taskIds).toContain(followedTask.id);
    });
  });

  describe('current user tasks', () => {
    it('resolves current user tasks', async () => {
      const { user, user2, patient, task1, task2, patientGoal } = await setup(txn);
      await Task.create(
        {
          title: 'Task 3 Title',
          description: 'description',
          dueAt: new Date().toISOString(),
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user2.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );

      const result = await graphql(
        schema,
        tasksForCurrentUserQuery,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10 },
      );

      expect(cloneDeep(result.data!.tasksForCurrentUser.edges)).toHaveLength(2);
      const titles = cloneDeep(result.data!.tasksForCurrentUser.edges).map(
        (edge: any) => edge.node.title,
      );
      expect(titles).toContain(task1.title);
      expect(titles).toContain(task2.title);
    });

    it('returns correct page information', async () => {
      const { user } = await setup(txn);
      const result = await graphql(
        schema,
        tasksForCurrentUserQuery,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 1 },
      );
      expect(cloneDeep(result.data!.tasksForCurrentUser)).toMatchObject({
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });

    it('can alter sort order', async () => {
      const { task1, user } = await setup(txn);
      const result = await graphql(
        schema,
        tasksForCurrentUserQuery,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 1, orderBy: 'dueAtAsc' },
      );
      expect(cloneDeep(result.data!.tasksForCurrentUser)).toMatchObject({
        edges: [
          {
            node: {
              id: task1.id,
              title: task1.title,
            },
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });
  });
});
