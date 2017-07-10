import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Task from '../../models/task';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('task follower', () => {

  let db: Db = null as any;
  let task = null as any;
  let user = null as any;
  const userRole = 'physician';
  const homeClinicId = '1';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({
      email: 'a@b.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
      homeClinicId,
    });
    const patient = await createPatient(createMockPatient(), user.id);
    const dueAt = new Date().toUTCString();
    task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('task followers', () => {
    it('adds and removes user to from task followers', async () => {
      const mutation = `mutation {
        taskUserFollow(input: { userId: "${user.id}", taskId: "${task.id}" }) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      const taskFollowers = cloneDeep(result.data!.taskUserFollow).map((u: any) => u.id);
      expect(taskFollowers).toContain(user.id);

      // unfollow
      const unfollowMutation = `mutation {
        taskUserUnfollow(input: { userId: "${user.id}", taskId: "${task.id}" }) {
          id
        }
      }`;
      const unfollowResult = await graphql(schema, unfollowMutation, null, { db, userRole });
      const taskFollowersUnfollowed = cloneDeep(
        unfollowResult.data!.taskUserUnfollow,
      ).map((u: any) => u.id);
      expect(taskFollowersUnfollowed).not.toContain(user.id);
    });

    it('resolves users following a task', async () => {
      const followMutation = `mutation {
        taskUserFollow(input: { userId: "${user.id}", taskId: "${task.id}" }) {
          id
        }
      }`;
      await graphql(schema, followMutation, null, { db, userRole });

      const query = `{
        taskFollowers(taskId: "${task.id}") {
          id
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const taskFollowers = cloneDeep(result.data!.taskFollowers)
        .map((u: any) => u.id);

      expect(taskFollowers).toContain(user.id);
    });
  });
});
