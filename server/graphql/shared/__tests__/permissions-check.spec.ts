import { transaction, Transaction } from 'objection';
import { permissionsMappings } from '../../../../shared/permissions/permissions-mapping';
import Db from '../../../db';
import Clinic from '../../../models/clinic';
import User from '../../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../../spec-helpers';
import checkUserPermissions, {
  getBusinessToggles,
  isAllowedForPermissions,
  isUserOnPatientCareTeam,
} from '../permissions-check';

interface ISetup {
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  return { clinic };
}

describe('User Permissions Check', () => {
  const userId = 'sansaStark';

  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('checkUserPermissions', () => {
    it('throws an error if the user is not logged in', async () => {
      await transaction(User.knex(), async txn => {
        await expect(checkUserPermissions('', 'green', 'view', 'user', txn)).rejects.toMatchObject(
          new Error('not logged in'),
        );
      });
    });

    it('throws an error if no permissions level provided', async () => {
      await transaction(User.knex(), async txn => {
        await expect(
          checkUserPermissions(userId, '' as any, 'view', 'user', txn),
        ).rejects.toMatchObject(new Error('No user permissions level provided'));
      });
    });

    it('returns true if action is allowed without checking care team', async () => {
      await transaction(User.knex(), async txn => {
        expect(await checkUserPermissions(userId, 'green', 'delete', 'user', txn)).toBe(true);
      });
    });

    it('throws an error if action is not allowed', async () => {
      await transaction(User.knex(), async txn => {
        await expect(
          checkUserPermissions(userId, 'red', 'delete', 'user', txn),
        ).rejects.toMatchObject(new Error('red not able to delete user'));
      });
    });

    it('throws an error if action allowed but user not on relevant care team', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, 'admin', 'care@care.com'),
          txn,
        );
        const user2 = await User.create(
          createMockUser(12, clinic.id, 'admin', 'care2@care.com'),
          txn,
        );
        const patient = await createPatient(
          {
            cityblockId: 123,
            homeClinicId: clinic.id,
            userId: user.id,
          },
          txn,
        );
        await expect(
          checkUserPermissions(user2.id, 'red', 'view', 'patient', txn, patient.id),
        ).rejects.toMatchObject(new Error('red not able to view patient'));
      });
    });

    it('returns true if action conditionally allowed but user on relevant care team', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, 'admin', 'care@care.com'),
          txn,
        );

        const patient = await createPatient(
          {
            cityblockId: 123,
            homeClinicId: clinic.id,
            userId: user.id,
          },
          txn,
        );
        expect(await checkUserPermissions(user.id, 'red', 'view', 'patient', txn, patient.id)).toBe(
          true,
        );
      });
    });
  });

  describe('isAllowedForPermissions', () => {
    it('returns true if an action is allowed for one of business toggles', async () => {
      expect(await isAllowedForPermissions('green', 'edit', 'concern', false)).toBe(true);
    });

    it('returns true if an action is not allowed for any of business toggles', async () => {
      expect(await isAllowedForPermissions('red', 'edit', 'concern', false)).toBe(false);
    });
  });

  describe('getBusinessToggles', () => {
    it('returns business toggles for a given permissions level', () => {
      const color = 'orange';
      expect(getBusinessToggles(color)).toEqual(permissionsMappings[color]);
    });
  });

  describe('isUserOnPatientCareTeam', () => {
    it('returns true if resource does not have patient id concept', async () => {
      await transaction(User.knex(), async txn => {
        expect(await isUserOnPatientCareTeam(userId, 'CBOReferral', 'CBOReferralId', txn)).toBe(
          true,
        );
      });
    });

    it('returns false if check required but no resource id provided', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, 'admin', 'care@care.com'),
          txn,
        );
        const result = await isUserOnPatientCareTeam(user.id, 'patient', '', txn);

        expect(result).toBe(false);
      });
    });

    it('returns false if user not on resource care team', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, 'admin', 'care@care.com'),
          txn,
        );
        const user2 = await User.create(
          createMockUser(12, clinic.id, 'admin', 'care2@care.com'),
          txn,
        );
        const patient = await createPatient(
          {
            cityblockId: 123,
            homeClinicId: clinic.id,
            userId: user.id,
          },
          txn,
        );
        const result = await isUserOnPatientCareTeam(user2.id, 'patient', patient.id, txn);

        expect(result).toBe(false);
      });
    });

    it('returns true if user on resource care team', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, 'admin', 'care@care.com'),
          txn,
        );
        const patient = await createPatient(
          {
            cityblockId: 123,
            homeClinicId: clinic.id,
            userId: user.id,
          },
          txn,
        );
        const result = await isUserOnPatientCareTeam(user.id, 'patient', patient.id, txn);

        expect(result).toBe(true);
      });
    });
  });
});
