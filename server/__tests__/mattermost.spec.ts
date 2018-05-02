import axios from 'axios';
import { transaction, Transaction } from 'objection';
import Db from '../db';
import Mattermost from '../mattermost';
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
  const user = await User.create(createMockUser(11, clinic.id, 'admin'), txn);
  const patient = await createPatient(
    { cityblockId: 123, homeClinicId: clinic.id, userId: user.id },
    txn,
  );

  return { patient, user };
}

describe('Mattermost', () => {
  let txn = null as any;

  const mattermost = Mattermost.get();

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(Patient.knex());
    axios.post = jest.fn();
    axios.get = jest.fn().mockReturnValue({ data: { id: 'fakeId' } });
    axios.delete = jest.fn();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create channel for patient', () => {
    it('creates a channel for a given patient', async () => {
      const { patient } = await setup(txn);

      await mattermost.createChannelForPatient(patient);

      expect(axios.post).toBeCalledWith(
        `${mattermostUrl}/channels`,
        {
          display_name: 'Dan Plant 123',
          name: 'dan-plant-123',
          team_id: teamId,
          type: 'P',
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
        `${mattermostUrl}/teams/${teamId}/channels/name/dan-plant-123`,
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
});
