import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import uuid from 'uuid/v4';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import User from '../user';
import UserHours from '../user-hours';

const userRole = 'physician' as UserRole;

interface ISetup {
  user: User;
}

const setup = async (txn: Transaction): Promise<ISetup> => {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);

  return { user };
};

describe('User Hours Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(UserHours.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('should create user hours', async () => {
      const { user } = await setup(txn);

      const userHours = await UserHours.create(
        {
          userId: user.id,
          weekday: 0,
          startTime: 800,
          endTime: 1400,
        },
        txn,
      );

      expect(userHours).toMatchObject({
        userId: user.id,
        weekday: 0,
        timeRange: '[800,1401)',
      });

      const parsed = UserHours.withStartAndEndTime(userHours);

      expect(parsed).toMatchObject({
        userId: user.id,
        weekday: 0,
        startTime: 800,
        endTime: 1400,
      });
    });

    it('should not create user hours with invalid time range', async () => {
      const { user } = await setup(txn);

      await expect(
        UserHours.create(
          {
            userId: user.id,
            weekday: 0,
            startTime: 800,
            endTime: 2401,
          },
          txn,
        ),
      ).rejects.toMatch('start: 800 and end: 2401 must be between 0 and 2400');
    });

    it('should not create user hours with invalid time stamp', async () => {
      const { user } = await setup(txn);

      await expect(
        UserHours.create(
          {
            userId: user.id,
            weekday: 0,
            startTime: 800,
            endTime: 860,
          },
          txn,
        ),
      ).rejects.toMatch('start: 800 and end: 860 must be valid times');
    });
  });

  describe('createDefaultsForUser', () => {
    it('creates hours for user based on template', async () => {
      const { user } = await setup(txn);
      const userHours = await UserHours.getForUser(user.id, txn);

      // delete default hours first
      const promises: Array<Promise<UserHours>> = [];

      userHours.forEach(hours => {
        promises.push(UserHours.delete(hours.id, txn));
      });

      await Promise.all(promises);

      const templates = [
        {
          weekday: 1,
          startTime: 800,
          endTime: 1200,
        },
        {
          weekday: 3,
          startTime: 1300,
          endTime: 1800,
        },
        {
          weekday: 5,
          startTime: 900,
          endTime: 930,
        },
      ];

      const allHours = await UserHours.createDefaultsForUser(user.id, templates, txn);

      expect(allHours).toMatchObject([
        {
          weekday: 1,
          userId: user.id,
          timeRange: '[800,1201)',
        },
        {
          weekday: 3,
          userId: user.id,
          timeRange: '[1300,1801)',
        },
        {
          weekday: 5,
          userId: user.id,
          timeRange: '[900,931)',
        },
      ]);
    });
  });

  describe('edit', () => {
    it('updates hours for given user and weekday', async () => {
      const { user } = await setup(txn);

      const userHours = await UserHours.create(
        {
          userId: user.id,
          weekday: 0,
          startTime: 800,
          endTime: 1400,
        },
        txn,
      );

      const edited = await UserHours.edit(
        userHours.id,
        {
          startTime: 1200,
          endTime: 1800,
        },
        txn,
      );

      expect(edited).toMatchObject({
        userId: user.id,
        weekday: 0,
        timeRange: '[1200,1801)',
      });
    });
  });

  describe('delete', () => {
    it('marks user hours as deleted', async () => {
      const { user } = await setup(txn);

      const userHours = await UserHours.create(
        {
          userId: user.id,
          weekday: 0,
          startTime: 800,
          endTime: 1400,
        },
        txn,
      );

      expect(userHours.deletedAt).toBeFalsy();

      const deleted = await UserHours.delete(userHours.id, txn);

      expect(deleted.deletedAt).toBeTruthy();
    });

    it('does not delete non-existant user hours', async () => {
      const fakeId = uuid();

      await expect(UserHours.delete(fakeId, txn)).rejects.toMatch(`No such userHours: ${fakeId}`);
    });
  });

  describe('getForUser', () => {
    it('should get all non-deleted hours for a given user', async () => {
      const { user } = await setup(txn);
      const userHours = await UserHours.getForUser(user.id, txn);

      // delete default hours first
      const promises: Array<Promise<UserHours>> = [];

      userHours.forEach(hours => {
        promises.push(UserHours.delete(hours.id, txn));
      });

      await Promise.all(promises);

      const userHours0 = await UserHours.create(
        {
          userId: user.id,
          weekday: 0,
          startTime: 800,
          endTime: 1400,
        },
        txn,
      );

      const userHours1 = await UserHours.create(
        {
          userId: user.id,
          weekday: 1,
          startTime: 400,
          endTime: 1200,
        },
        txn,
      );

      await UserHours.create(
        {
          userId: user.id,
          weekday: 2,
          startTime: 1300,
          endTime: 1500,
        },
        txn,
      );

      await UserHours.delete(userHours0.id, txn);
      await UserHours.edit(
        userHours1.id,
        {
          startTime: 1600,
          endTime: 2030,
        },
        txn,
      );

      const allHours = await UserHours.getForUser(user.id, txn);

      expect(allHours).toMatchObject([
        {
          userId: user.id,
          weekday: 1,
          timeRange: '[1600,2031)',
        },
        {
          userId: user.id,
          weekday: 2,
          timeRange: '[1300,1501)',
        },
      ]);
    });
  });
});
