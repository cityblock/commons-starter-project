import { transaction } from 'objection';
import {
  IRootMutationType,
  IRootQueryType,
  IUserHoursCreateInput,
  IUserHoursDeleteInput,
  IUserHoursEditInput,
  Permissions,
} from 'schema';
import UserHours from '../models/user-hours';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IUserHoursCreateArgs {
  input: IUserHoursCreateInput;
}

export interface IUserHoursEditArgs {
  input: IUserHoursEditInput;
}

export interface IUserHoursDeleteArgs {
  input: IUserHoursDeleteInput;
}

export async function userHoursCreate(
  root: {},
  { input }: IUserHoursCreateArgs,
  { logger, userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['userHoursCreate']> {
  const { weekday, startTime, endTime } = input;

  return transaction(testTransaction || UserHours.knex(), async txn => {
    await checkUserPermissions(userId, permissions as Permissions, 'edit', 'user', txn);

    logger.log(`CREATE userHours for ${userId} by ${userId}`);

    const userHours = await UserHours.create(
      {
        userId: userId!,
        weekday,
        startTime,
        endTime,
      },
      txn,
    );

    return UserHours.withStartAndEndTime(userHours);
  });
}

export async function userHoursEdit(
  root: {},
  { input }: IUserHoursEditArgs,
  { logger, userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['userHoursEdit']> {
  const { userHoursId, startTime, endTime } = input;

  return transaction(testTransaction || UserHours.knex(), async txn => {
    await checkUserPermissions(userId, permissions as Permissions, 'edit', 'user', txn);

    logger.log(`EDIT userHours for ${userId} by ${userId}`);

    const userHours = await UserHours.edit(
      userHoursId,
      {
        startTime,
        endTime,
      },
      txn,
    );

    return UserHours.withStartAndEndTime(userHours);
  });
}

export async function userHoursDelete(
  root: {},
  { input }: IUserHoursDeleteArgs,
  { logger, userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['userHoursDelete']> {
  const { userHoursId } = input;

  return transaction(testTransaction || UserHours.knex(), async txn => {
    await checkUserPermissions(userId, permissions as Permissions, 'edit', 'user', txn);

    logger.log(`DELETE userHours for ${userId} by ${userId}`);

    const userHours = await UserHours.delete(userHoursId, txn);

    return UserHours.withStartAndEndTime(userHours);
  });
}

export async function resolveCurrentUserHours(
  root: {},
  args: {},
  { logger, userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['currentUserHours']> {
  return transaction(testTransaction || UserHours.knex(), async txn => {
    await checkUserPermissions(userId, permissions as Permissions, 'view', 'user', txn);

    logger.log(`GET userHours for ${userId} by ${userId}`);

    const allHours = await UserHours.getForUser(userId!, txn);

    return allHours.map(userHours => UserHours.withStartAndEndTime(userHours));
  });
}
