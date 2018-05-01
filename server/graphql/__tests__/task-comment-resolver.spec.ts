import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import Task from '../../models/task';
import TaskComment from '../../models/task-comment';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  task: Task;
  user: User;
  clinic: Clinic;
}

const userRole = 'physician';
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
  let db: Db;

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
        db,
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.taskCommentCreate.body)).toEqual('my comment');
      const taskEvents1 = await TaskEvent.getTaskEvents(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents1.total).toEqual(1);
      expect(taskEvents1.results[0].eventType).toEqual('add_comment');

      // delete comment
      const deleteMutation = `mutation {
          taskCommentDelete(input: { taskCommentId: "${result.data!.taskCommentCreate.id}" }) {
            id
          }
        }`;
      await graphql(schema, deleteMutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const taskEvents2 = await TaskEvent.getTaskEvents(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents2.total).toEqual(2);
      expect(taskEvents2.results.find(event => event.eventType === 'delete_comment')).toBeTruthy();

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
        db,
        permissions,
        userId: user.id,
        txn,
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
        db,
        permissions,
        userId: user.id,
        txn,
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
        db,
        permissions,
        userId: user.id,
        txn,
      });

      expect(cloneDeep(editedComment.data!.taskCommentEdit.body)).toEqual('cool new comment');
      const taskEvents = await TaskEvent.getTaskEvents(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents.total).toEqual(2);
      expect(taskEvents.results.find(event => event.eventType === 'edit_comment')).toBeTruthy();
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
      await graphql(schema, mutation, null, { db, permissions, userId: user.id, txn });

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
        db,
        permissions,
        userId: user.id,
        txn,
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
      db,
      permissions,
      userId: user.id,
      txn,
    });

    expect(cloneDeep(result.data!.taskComment)).toMatchObject({
      id: taskComment.id,
      body: taskComment.body,
    });
  });
});
