import { graphql } from 'graphql';
import * as kue from 'kue';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import Task from '../../models/task';
import TaskComment from '../../models/task-comment';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

const queue = kue.createQueue();

interface ISetup {
  task: Task;
  user: User;
  clinic: Clinic;
}

const userRole = 'physician' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
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

  const task = await Task.create(
    {
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    },
    txn,
  );

  return { task, user, clinic };
}

describe('task comments', () => {
  let txn = null as any;

  beforeAll(() => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
    queue.testMode.clear();
  });

  afterEach(async () => {
    await txn.rollback();
    txn = null;
  });

  describe('task comments', () => {
    it('adds and removes a comment', async () => {
      // add comment
      const { task, user } = await setup(txn);
      const mutation = `mutation {
          taskCommentCreate(
            input: { taskId: "${task.id}", body: "my comment" }
          ) {
            id, body
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.taskCommentCreate.body)).toEqual('my comment');

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        userId: user.id,
        taskId: task.id,
        eventType: 'add_comment',
        eventCommentId: result.data!.taskCommentCreate.id,
      });

      // delete comment
      const deleteMutation = `mutation {
          taskCommentDelete(input: { taskCommentId: "${result.data!.taskCommentCreate.id}" }) {
            id
          }
        }`;
      await graphql(schema, deleteMutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });

      expect(queue.testMode.jobs.length).toBe(2);
      expect(queue.testMode.jobs[1].data).toMatchObject({
        userId: user.id,
        taskId: task.id,
        eventType: 'delete_comment',
        eventCommentId: result.data!.taskCommentCreate.id,
      });

      // get comments
      const getComments = `{ taskComments(taskId: "${task.id}") {
            edges {
              node {
                body
              }
            }
          }
        }`;
      const taskComments = await graphql(schema, getComments, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(taskComments.data!.taskComments.edges)).toHaveLength(0);
    });

    it('edits a comment', async () => {
      // add comment
      const { task, user } = await setup(txn);
      const mutation = `mutation {
          taskCommentCreate(
            input: { taskId: "${task.id}", body: "my comment" }
          ) {
            id, body
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.taskCommentCreate.body)).toEqual('my comment');

      // edit comment
      const editMutation = `mutation {
          taskCommentEdit(input: {
              taskCommentId: "${result.data!.taskCommentCreate.id}",
              body: "cool new comment"
          }) {
            id, body
          }
        }`;
      const editedComment = await graphql(schema, editMutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });

      expect(cloneDeep(editedComment.data!.taskCommentEdit.body)).toEqual('cool new comment');

      expect(queue.testMode.jobs.length).toBe(2);
      expect(queue.testMode.jobs[1].data).toMatchObject({
        userId: user.id,
        taskId: task.id,
        eventType: 'edit_comment',
        eventCommentId: result.data!.taskCommentCreate.id,
      });
    });

    it('resolves task comments', async () => {
      // add comment
      const { task, user } = await setup(txn);
      const mutation = `mutation {
          taskCommentCreate(
            input: { taskId: "${task.id}", body: "my comment" }
          ) {
            id, body
          }
        }`;
      await graphql(schema, mutation, null, { permissions, userId: user.id, testTransaction: txn });

      const query = `{
          taskComments(taskId: "${task.id}",pageNumber: 0, pageSize: 1) {
            edges {
              node {
                id, body
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });

      expect(cloneDeep(result.data!.taskComments)).toMatchObject({
        edges: [
          {
            node: {
              body: 'my comment',
            },
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });
  });

  it('resolves a single task comment', async () => {
    const { task, user } = await setup(txn);
    const taskComment = await TaskComment.create(
      {
        userId: user.id,
        taskId: task.id,
        body: 'my comment',
      },
      txn,
    );

    const query = `{
        taskComment(taskCommentId: "${taskComment.id}") {
          id, body
        }
      }`;

    const result = await graphql(schema, query, null, {
      permissions,
      userId: user.id,
      testTransaction: txn,
    });

    expect(cloneDeep(result.data!.taskComment)).toMatchObject({
      id: taskComment.id,
      body: taskComment.body,
    });
  });
});
