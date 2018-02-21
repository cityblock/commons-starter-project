import { subHours } from 'date-fns';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import ProgressNote from '../progress-note';
import ProgressNoteGlassBreak from '../progress-note-glass-break';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'admin';
const reason = 'Other';
const note = 'New phone who dis';

interface ISetup {
  user: User;
  patient: Patient;
  clinic: Clinic;
  progressNoteTemplate: ProgressNoteTemplate;
  progressNote: ProgressNote;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 12, homeClinicId: clinic.id }, txn);
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

  return { clinic, user, patient, progressNote, progressNoteTemplate };
}

describe('Progress Note Glass Break Model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get a progress note glass break', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const { user, progressNote } = await setup(txn);

      const progressNoteGlassBreak = await ProgressNoteGlassBreak.create(
        {
          userId: user.id,
          progressNoteId: progressNote.id,
          reason,
          note,
        },
        txn,
      );

      expect(progressNoteGlassBreak).toMatchObject({
        userId: user.id,
        progressNoteId: progressNote.id,
        reason,
        note,
      });

      expect(await ProgressNoteGlassBreak.get(progressNoteGlassBreak.id, txn)).toMatchObject({
        userId: user.id,
        progressNoteId: progressNote.id,
        reason,
        note,
      });
    });
  });

  it('throws an error if the progress note glass break does not exist for given id', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const fakeId = uuid();
      const error = `No such progress note glass break: ${fakeId}`;
      await expect(ProgressNoteGlassBreak.get(fakeId, txn)).rejects.toMatch(error);
    });
  });

  it('validates a recent glass break', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const { user, progressNote } = await setup(txn);

      const progressNoteGlassBreak = await ProgressNoteGlassBreak.create(
        {
          userId: user.id,
          progressNoteId: progressNote.id,
          reason,
          note,
        },
        txn,
      );

      expect(await ProgressNoteGlassBreak.validateGlassBreak(progressNoteGlassBreak.id, txn)).toBe(
        true,
      );
    });
  });

  it('invalidates a glass break with a fake id', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const fakeId = uuid();
      const error = `No such progress note glass break: ${fakeId}`;
      await expect(ProgressNoteGlassBreak.validateGlassBreak(fakeId, txn)).rejects.toMatch(error);
    });
  });

  it('invalidates a glass break that was created too long ago', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const { user, progressNote } = await setup(txn);

      const patientGlassBreak = await ProgressNoteGlassBreak.create(
        {
          userId: user.id,
          progressNoteId: progressNote.id,
          reason,
          note,
        },
        txn,
      );

      await ProgressNoteGlassBreak.query(txn)
        .where({ userId: user.id, progressNoteId: progressNote.id })
        .patch({ createdAt: subHours(new Date(), 9).toISOString() });

      const error = `Glass break ${patientGlassBreak.id} occurred too long ago`;

      await expect(
        ProgressNoteGlassBreak.validateGlassBreak(patientGlassBreak.id, txn),
      ).rejects.toMatch(error);
    });
  });

  it('gets all patient glass breaks for the current user session', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const { user, progressNote, progressNoteTemplate, patient } = await setup(txn);
      const progressNote2 = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );

      const progressNoteGlassBreak = await ProgressNoteGlassBreak.create(
        {
          userId: user.id,
          progressNoteId: progressNote.id,
          reason,
          note,
        },
        txn,
      );
      const tooOldGlassBreak = await ProgressNoteGlassBreak.create(
        {
          userId: user.id,
          progressNoteId: progressNote.id,
          reason,
          note,
        },
        txn,
      );
      const otherProgressNoteGlassBreak = await ProgressNoteGlassBreak.create(
        {
          userId: user.id,
          progressNoteId: progressNote2.id,
          reason,
          note,
        },
        txn,
      );

      await ProgressNoteGlassBreak.query(txn)
        .where({ id: tooOldGlassBreak.id })
        .patch({ createdAt: subHours(new Date(), 9).toISOString() });

      const glassBreaks = await ProgressNoteGlassBreak.getForCurrentUserSession(user.id, txn);

      expect(glassBreaks.length).toBe(2);

      expect(
        glassBreaks.find(glassBreak => glassBreak.id === progressNoteGlassBreak.id),
      ).toMatchObject({
        ...progressNoteGlassBreak,
      });
      expect(
        glassBreaks.find(glassBreak => glassBreak.id === otherProgressNoteGlassBreak.id),
      ).toMatchObject({
        ...otherProgressNoteGlassBreak,
      });
    });
  });
});
