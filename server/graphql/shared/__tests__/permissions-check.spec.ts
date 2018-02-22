import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import { permissionsMappings } from '../../../../shared/permissions/permissions-mapping';
import Db from '../../../db';
import Clinic from '../../../models/clinic';
import Patient from '../../../models/patient';
import PatientGlassBreak from '../../../models/patient-glass-break';
import ProgressNote from '../../../models/progress-note';
import ProgressNoteTemplate from '../../../models/progress-note-template';
import User from '../../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../../spec-helpers';
import checkUserPermissions, {
  checkLoggedInWithPermissions,
  getBusinessToggles,
  getGlassBreakModel,
  isAllowedForPermissions,
  isUserOnPatientCareTeam,
  validateGlassBreak,
  validateGlassBreakNotNeeded,
} from '../permissions-check';

const reason = "Demogorgon says it's cool";

interface ISetup {
  clinic: Clinic;
  user: User;
  patient: Patient;
  progressNoteTemplate: ProgressNoteTemplate;
  progressNote: ProgressNote;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'admin'), txn);
  const patient = await createPatient(
    { cityblockId: 12, homeClinicId: clinic.id, userId: user.id },
    txn,
  );
  const progressNoteTemplate = await ProgressNoteTemplate.create(
    {
      title: 'title',
    },
    txn,
  );
  const progressNote = await ProgressNote.create(
    {
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    },
    txn,
  );

  return { user, patient, clinic, progressNoteTemplate, progressNote };
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

    it('returns true if resource does not map to a specific model instance', async () => {
      await transaction(User.knex(), async txn => {
        expect(await isUserOnPatientCareTeam(userId, 'allPatients', '', txn)).toBe(true);
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

  describe('checkLoggedInWithPermissions', () => {
    it('throws error if user not logged in', () => {
      expect(() => {
        checkLoggedInWithPermissions('', 'green');
      }).toThrowError('not logged in');
    });

    it('throws error if no user permissions given', () => {
      expect(() => {
        checkLoggedInWithPermissions(userId, '' as any);
      }).toThrowError('No user permissions level provided');
    });

    it('returns true if user logged in and permissions specified', () => {
      expect(checkLoggedInWithPermissions(userId, 'blue')).toBe(true);
    });
  });

  describe('getGlassBreakModel', () => {
    it('returns mapped glass break resource if it exists', () => {
      expect(getGlassBreakModel('patient')).toEqual(PatientGlassBreak);
    });

    it('throws an error if resource not mapped', () => {
      const error = 'Resource does not have required glass break methods or not mapped properly';

      expect(() => {
        getGlassBreakModel('CBO');
      }).toThrowError(error);
    });
  });

  describe('validateGlassBreak', () => {
    it('validates glass break id if provided', async () => {
      await transaction(PatientGlassBreak.knex(), async txn => {
        const { user, patient } = await setup(txn);
        const patientGlassBreak = await PatientGlassBreak.create(
          {
            userId: user.id,
            patientId: patient.id,
            reason,
            note: null,
          },
          txn,
        );

        const result = await validateGlassBreak(
          user.id,
          'blue',
          'patient',
          patient.id,
          txn,
          patientGlassBreak.id,
        );

        expect(result).toBeTruthy();
      });
    });

    it('invalidates invalid glass break id', async () => {
      await transaction(PatientGlassBreak.knex(), async txn => {
        const fakeId = uuid();
        const { user, patient } = await setup(txn);

        try {
          await validateGlassBreak(user.id, 'blue', 'patient', patient.id, txn, fakeId);
        } catch (err) {
          expect(err).toBe(`No such glass break: ${fakeId}`);
        }
      });
    });

    it('creates a glass break for a user that can auto break glass', async () => {
      await transaction(PatientGlassBreak.knex(), async txn => {
        const { user, patient } = await setup(txn);

        const result = await validateGlassBreak(user.id, 'green', 'patient', patient.id, txn, null);

        expect(result).toBeTruthy();

        const glassBreak = await PatientGlassBreak.query(txn).findOne({
          userId: user.id,
          patientId: patient.id,
        });

        expect(glassBreak).toMatchObject({
          userId: user.id,
          patientId: patient.id,
        });
      });
    });

    it('validates glass break not needed if user on patient care team', async () => {
      await transaction(PatientGlassBreak.knex(), async txn => {
        const { user, patient } = await setup(txn);

        const result = await validateGlassBreak(user.id, 'blue', 'patient', patient.id, txn, null);

        expect(result).toBeTruthy();
      });
    });

    it('invalidates glass break not needed if user not on patient care team', async () => {
      await transaction(PatientGlassBreak.knex(), async txn => {
        const { patient, clinic } = await setup(txn);
        const user2 = await User.create(createMockUser(11, clinic.id, 'admin'), txn);

        try {
          await validateGlassBreak(user2.id, 'blue', 'patient', patient.id, txn, null);
        } catch (err) {
          expect(err).toEqual(
            new Error(
              `User ${user2.id} cannot automatically break the glass for patient ${patient.id}`,
            ),
          );
        }
      });
    });
  });

  describe('validateGlassBreakNotNeeded', () => {
    describe('patient', () => {
      it('returns true if patient on care team', async () => {
        await transaction(PatientGlassBreak.knex(), async txn => {
          const { user, patient } = await setup(txn);

          const result = await validateGlassBreakNotNeeded(user.id, 'patient', patient.id, txn);

          expect(result).toBeTruthy();
        });
      });

      it('returns false if patient not on care team', async () => {
        await transaction(PatientGlassBreak.knex(), async txn => {
          const { patient, clinic } = await setup(txn);
          const user2 = await User.create(createMockUser(11, clinic.id, 'admin'), txn);

          const result = await validateGlassBreakNotNeeded(user2.id, 'patient', patient.id, txn);

          expect(result).toBeFalsy();
        });
      });
    });

    it('validates glass break not needed for progress notes whose templates do not require glass break', async () => {
      await transaction(PatientGlassBreak.knex(), async txn => {
        const { progressNote, clinic } = await setup(txn);
        const user2 = await User.create(createMockUser(11, clinic.id, 'admin'), txn);

        expect(
          await validateGlassBreakNotNeeded(user2.id, 'progressNote', progressNote.id, txn),
        ).toBeTruthy();
      });
    });

    it('validates glass break not needed for progress notes authored by given user', async () => {
      await transaction(PatientGlassBreak.knex(), async txn => {
        const { user, progressNote, progressNoteTemplate } = await setup(txn);
        await ProgressNoteTemplate.query(txn)
          .where({ id: progressNoteTemplate.id })
          .patch({ requiresGlassBreak: true });

        expect(
          await validateGlassBreakNotNeeded(user.id, 'progressNote', progressNote.id, txn),
        ).toBeTruthy();
      });
    });

    it('invalidates glass break by non-author when template requires glass break', async () => {
      await transaction(PatientGlassBreak.knex(), async txn => {
        const { progressNote, progressNoteTemplate, clinic } = await setup(txn);
        await ProgressNoteTemplate.query(txn)
          .where({ id: progressNoteTemplate.id })
          .patch({ requiresGlassBreak: true });

        const user2 = await User.create(createMockUser(11, clinic.id, 'admin'), txn);

        expect(
          await validateGlassBreakNotNeeded(user2.id, 'progressNote', progressNote.id, txn),
        ).toBeFalsy();
      });
    });
  });
});
