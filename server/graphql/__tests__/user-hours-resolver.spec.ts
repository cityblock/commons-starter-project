import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as getCurrentUserHours from '../../../app/graphql/queries/get-current-user-hours.graphql';
import * as userHoursCreate from '../../../app/graphql/queries/user-hours-create-mutation.graphql';
import * as userHoursDelete from '../../../app/graphql/queries/user-hours-delete-mutation.graphql';
import * as userHoursEdit from '../../../app/graphql/queries/user-hours-edit-mutation.graphql';
import Clinic from '../../models/clinic';
import User from '../../models/user';
import UserHours from '../../models/user-hours';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'physician' as UserRole;

interface ISetup {
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);

  return { user };
}

describe('User Hours Resolver', () => {
  const currentUserHoursQuery = print(getCurrentUserHours);
  const userHoursCreateMutation = print(userHoursCreate);
  const userHoursEditMutation = print(userHoursEdit);
  const userHoursDeleteMutation = print(userHoursDelete);

  const log = jest.fn();
  const logger = { log };

  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(UserHours.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('userHoursCreate', () => {
    it('creates hours for a given user and weekday', async () => {
      const { user } = await setup(txn);

      const result = await graphql(
        schema,
        userHoursCreateMutation,
        null,
        {
          userId: user.id,
          permissions: 'green',
          testTransaction: txn,
          logger,
        },
        {
          weekday: 0,
          startTime: 1200,
          endTime: 1530,
        },
      );

      expect(result.data!.userHoursCreate).toMatchObject({
        userId: user.id,
        startTime: 1200,
        endTime: 1530,
        weekday: 0,
      });

      expect(log).toBeCalled();
    });
  });

  describe('userHoursEdit', () => {
    it('edits hours for a given user hours block', async () => {
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

      const result = await graphql(
        schema,
        userHoursEditMutation,
        null,
        {
          userId: user.id,
          permissions: 'green',
          testTransaction: txn,
          logger,
        },
        {
          userHoursId: userHours.id,
          startTime: 900,
          endTime: 1400,
        },
      );

      expect(result.data!.userHoursEdit).toMatchObject({
        userId: user.id,
        weekday: 0,
        startTime: 900,
        endTime: 1400,
      });

      expect(log).toBeCalled();
    });
  });

  describe('userHoursDelete', () => {
    it('deletes user hours for a given user and weekday', async () => {
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

      const result = await graphql(
        schema,
        userHoursDeleteMutation,
        null,
        {
          userId: user.id,
          permissions: 'green',
          testTransaction: txn,
          logger,
        },
        {
          userHoursId: userHours.id,
        },
      );

      expect(result.data!.userHoursDelete).toMatchObject({
        userId: user.id,
        weekday: 0,
        startTime: 800,
        endTime: 1400,
      });

      expect(result.data!.userHoursDelete.deletedAt).toBeTruthy();

      expect(log).toBeCalled();
    });
  });

  describe('currentUserHours', () => {
    it('gets list of current user hours', async () => {
      const { user } = await setup(txn);

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
          weekday: 6,
          startTime: 400,
          endTime: 1200,
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

      const result = await graphql(schema, currentUserHoursQuery, null, {
        userId: user.id,
        permissions: 'green',
        testTransaction: txn,
        logger,
      });

      expect(result.data!.currentUserHours).toMatchObject([
        {
          userId: user.id,
          weekday: 1,
          startTime: 800,
          endTime: 1800,
        },
        {
          userId: user.id,
          weekday: 2,
          startTime: 800,
          endTime: 1800,
        },
        {
          userId: user.id,
          weekday: 3,
          startTime: 800,
          endTime: 1800,
        },
        {
          userId: user.id,
          weekday: 4,
          startTime: 800,
          endTime: 1800,
        },
        {
          userId: user.id,
          weekday: 5,
          startTime: 800,
          endTime: 1800,
        },
        {
          userId: user.id,
          weekday: 6,
          startTime: 1600,
          endTime: 2030,
        },
      ]);

      expect(log).toBeCalled();
    });
  });
});
