import { transaction } from 'objection';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import QuickCall from '../quick-call';
import User from '../user';
const userRole = 'physician';

describe('quick call model', () => {
  let db: Db;
  let user: User;
  let patient: Patient;
  let clinic: Clinic;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and retreives quick call', async () => {
    await transaction(QuickCall.knex(), async txn => {
      const createdCall = await QuickCall.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason: 'Had to call the son',
          summary: 'package is on the way',
          startTime: new Date().toISOString(),
          direction: 'Outbound',
          callRecipient: 'The son',
          wasSuccessful: true,
        },
        txn,
      );
      const foundCall = await QuickCall.query(txn).findById(createdCall.id);

      expect(foundCall).not.toBeFalsy();
      expect(foundCall!.id).not.toBeFalsy();
      expect(foundCall!.createdAt).not.toBeFalsy();
    });
  });
});
