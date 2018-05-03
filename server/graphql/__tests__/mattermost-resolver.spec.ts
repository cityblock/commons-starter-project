import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import * as mattermostUrlForUserCreate from '../../../app/graphql/queries/mattermost-url-for-user-create.graphql';
import Db from '../../db';
import Mattermost from '../../mattermost';
import Clinic from '../../models/clinic';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'admin'), txn);

  return { user };
}

const permissions = 'blue';

describe('Mattermost Resolver', () => {
  let txn = null as any;
  const log = jest.fn();
  const logger = { log };
  const mattermostUrlForUserCreateMutation = print(mattermostUrlForUserCreate);

  beforeAll(async () => {
    await Db.get();
  });

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('gets a link to DM a given user by their e-mail', async () => {
    const { user } = await setup(txn);

    const dmLink = 'https://mattermost.com/dm/@jonSnow';
    const getLinkToMessageUser = jest.fn().mockReturnValue(dmLink);

    Mattermost.get = jest.fn().mockReturnValue({
      getLinkToMessageUser,
    });

    const result = await graphql(
      schema,
      mattermostUrlForUserCreateMutation,
      null,
      {
        userId: user.id,
        logger,
        permissions,
      },
      {
        email: 'jon.snow@cityblock.com',
      },
    );

    expect(result.data!.mattermostUrlForUserCreate.url).toBe(dmLink);
    expect(log).toBeCalled();
  });
});
