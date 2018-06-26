import axios from 'axios';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import queueHelpers from '../helpers/queue-helpers';
import Mattermost, { ADD_USER_TO_CHANNEL_TOPIC } from '../mattermost';
import Clinic from '../models/clinic';
import Patient from '../models/patient';
import User from '../models/user';
import { createMockClinic, createMockUser, createPatient } from '../spec-helpers';

interface ISetup {
  patient: Patient;
  user: User;
}

const mattermostUrl = 'https://mattermost-test.cityblock.com/api/v4';
const teamId = 'CITYBLOCKPARTY';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic('The Wall', 123455), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'Pharmacist' as UserRole), txn);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
      firstName: 'Sansa',
      lastName: 'Stark',
    },
    txn,
  );

  return { patient, user };
}

describe('Mattermost', () => {
  let txn = null as any;

  const mattermost = Mattermost.get();

  beforeEach(async () => {
    txn = await transaction.start(Patient.knex());
    axios.post = jest.fn();
    axios.put = jest.fn();
    axios.get = jest.fn().mockReturnValue({ data: { id: 'fakeId', username: 'dan' } });
    axios.delete = jest.fn();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create channel for patient', () => {
    it('creates a channel for a given patient', async () => {
      const { patient } = await setup(txn);

      await mattermost.createChannelForPatient(patient);

      expect(axios.post).toBeCalledWith(
        `${mattermostUrl}/channels`,
        {
          display_name: 'Sansa Stark 123',
          name: 'sansa-stark-123',
          team_id: teamId,
          type: 'P',
        },
        { headers: { Authorization: 'Bearer winterIsComing', 'Content-type': 'application/json' } },
      );
    });
  });

  describe('queue adding user to patient channel', () => {
    it('creates a job to add user to patient channel', async () => {
      const { user, patient } = await setup(txn);

      queueHelpers.addJobToQueue = jest.fn();

      mattermost.queueAddUserToPatientChannel(patient.id, user.id);

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        ADD_USER_TO_CHANNEL_TOPIC,
        {
          userId: user.id,
          patientId: patient.id,
        },
        {
          message: `Handling ${ADD_USER_TO_CHANNEL_TOPIC} message for patient: ${
            patient.id
          } and user: ${user.id}`,
          priority: 'high',
        },
      );
    });
  });

  describe('add a user to patient channel', () => {
    it('adds a user to patient channel', async () => {
      const { user, patient } = await setup(txn);

      await mattermost.addUserToPatientChannel(patient.id, user.id, txn);

      expect(axios.put).toHaveBeenCalledTimes(2);

      expect(axios.put).toBeCalledWith(
        `${mattermostUrl}/users/fakeId/patch`,
        {
          notify_props: { channel: 'false' },
        },
        { headers: { Authorization: 'Bearer winterIsComing', 'Content-type': 'application/json' } },
      );

      expect(axios.post).toBeCalledWith(
        `${mattermostUrl}/channels/fakeId/members`,
        {
          user_id: 'fakeId',
        },
        { headers: { Authorization: 'Bearer winterIsComing', 'Content-type': 'application/json' } },
      );

      expect(axios.put).toBeCalledWith(
        `${mattermostUrl}/users/fakeId/patch`,
        {
          notify_props: {},
        },
        { headers: { Authorization: 'Bearer winterIsComing', 'Content-type': 'application/json' } },
      );
    });
  });

  describe('remove user from patient channel', () => {
    it("removes a user from a given patient's channel", async () => {
      const { user, patient } = await setup(txn);

      await mattermost.removeUserFromPatientChannel(patient.id, user.id, txn);

      expect(axios.get).toBeCalledWith(
        `${mattermostUrl}/teams/${teamId}/channels/name/sansa-stark-123`,
        { headers: { Authorization: 'Bearer winterIsComing', 'Content-type': 'application/json' } },
      );

      expect(axios.get).toBeCalledWith(`${mattermostUrl}/users/email/${user.email}`, {
        headers: { Authorization: 'Bearer winterIsComing', 'Content-type': 'application/json' },
      });

      expect(axios.delete).toBeCalledWith(`${mattermostUrl}/channels/fakeId/members/fakeId`, {
        headers: { Authorization: 'Bearer winterIsComing', 'Content-type': 'application/json' },
      });
    });
  });

  describe('get user', () => {
    it('gets a user', async () => {
      const { user } = await setup(txn);

      const mattermostUser = await mattermost.getUser(user.id, txn);

      expect(axios.get).toBeCalledWith(`${mattermostUrl}/users/email/${user.email}`, {
        headers: { Authorization: 'Bearer winterIsComing', 'Content-type': 'application/json' },
      });

      expect(mattermostUser).toMatchObject({ id: 'fakeId', username: 'dan' });
    });
  });

  describe('get link to message user', () => {
    it('gets a link to message user', async () => {
      const { user } = await setup(txn);

      const link = await mattermost.getLinkToMessageUser(user.email);

      expect(axios.get).toBeCalledWith(`${mattermostUrl}/users/email/${user.email}`, {
        headers: { Authorization: 'Bearer winterIsComing', 'Content-type': 'application/json' },
      });

      expect(link).toBe('https://mattermost-test.cityblock.com/cityblock/messages/@dan');
    });
  });

  describe('get link to message care team', () => {
    it('gets a link to message care team', async () => {
      const { patient } = await setup(txn);

      const link = await mattermost.getLinkToMessageCareTeam(patient.id, txn);

      expect(link).toBe('https://mattermost-test.cityblock.com/cityblock/channels/sansa-stark-123');
    });
  });
});
