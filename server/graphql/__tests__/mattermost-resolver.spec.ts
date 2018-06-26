import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import mattermostUrlForPatientCreate from '../../../app/graphql/queries/mattermost-url-for-patient-create.graphql';
import mattermostUrlForUserCreate from '../../../app/graphql/queries/mattermost-url-for-user-create.graphql';

import Mattermost from '../../mattermost';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'Pharmacist' as UserRole), txn);
  const patient = await createPatient(
    { cityblockId: 123, homeClinicId: clinic.id, firstName: 'Arya', lastName: 'Stark' },
    txn,
  );

  return { user, patient };
}

const permissions = 'blue';

describe('Mattermost Resolver', () => {
  let txn = null as any;
  const log = jest.fn();
  const logger = { log };
  const mattermostUrlForUserCreateMutation = print(mattermostUrlForUserCreate);
  const mattermostUrlForPatientCreateMutation = print(mattermostUrlForPatientCreate);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
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

  it('gets a link to patient channel', async () => {
    const { patient, user } = await setup(txn);

    const channelLink = 'https://mattermost.com/channels/sansa-stark-123';
    const getLinkToMessageCareTeam = jest.fn().mockReturnValue(channelLink);

    Mattermost.get = jest.fn().mockReturnValue({
      getLinkToMessageCareTeam,
    });

    const result = await graphql(
      schema,
      mattermostUrlForPatientCreateMutation,
      null,
      {
        userId: user.id,
        logger,
        permissions,
        testTransaction: txn,
      },
      {
        patientId: patient.id,
      },
    );

    expect(result.data!.mattermostUrlForPatientCreate.url).toBe(channelLink);
    expect(log).toBeCalled();
  });
});
