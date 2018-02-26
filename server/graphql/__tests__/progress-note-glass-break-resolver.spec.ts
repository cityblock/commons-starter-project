import { subHours } from 'date-fns';
import { graphql } from 'graphql';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import ProgressNote from '../../models/progress-note';
import ProgressNoteGlassBreak from '../../models/progress-note-glass-break';
import ProgressNoteTemplate from '../../models/progress-note-template';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';
const permissions = 'green';
const reason = 'Needed to defeat Night King';
const note = 'Winter is Coming';

interface ISetup {
  user: User;
  patient: Patient;
  progressNoteTemplate: ProgressNoteTemplate;
  progressNote: ProgressNote;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
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
  await ProgressNoteTemplate.query(txn)
    .where({ id: progressNoteTemplate.id })
    .patch({ requiresGlassBreak: true });

  const progressNote = await ProgressNote.create(
    {
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    },
    txn,
  );

  return { user, patient, progressNote, progressNoteTemplate, clinic };
}

describe('Progress Note Glass Break Resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates a progress note glass break', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const { user, progressNote } = await setup(txn);

      const mutation = `mutation {
        progressNoteGlassBreakCreate(input: {
          progressNoteId: "${progressNote.id}"
          reason: "${reason}"
          note: "${note}"
        }) {
          id
          progressNoteId
          userId
          reason
          note
        }
      }`;

      const result = await graphql(schema, mutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });

      expect(result.data!.progressNoteGlassBreakCreate.id).toBeTruthy();
      expect(result.data!.progressNoteGlassBreakCreate.progressNoteId).toBe(progressNote.id);
      expect(result.data!.progressNoteGlassBreakCreate.userId).toBe(user.id);
      expect(result.data!.progressNoteGlassBreakCreate.reason).toBe(reason);
      expect(result.data!.progressNoteGlassBreakCreate.note).toBe(note);
    });
  });

  it('fetches progress note glass breaks for current user session', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const { user, patient, progressNoteTemplate, progressNote } = await setup(txn);
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

      const query = `{
        progressNoteGlassBreaksForUser {
          id
          progressNoteId
          userId
        }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });

      expect(result.data!.progressNoteGlassBreaksForUser.length).toBe(2);

      const glassBreak1 = result.data!.progressNoteGlassBreaksForUser.find(
        (glassBreak: ProgressNoteGlassBreak) => glassBreak.id === progressNoteGlassBreak.id,
      );
      const glassBreak2 = result.data!.progressNoteGlassBreaksForUser.find(
        (glassBreak: ProgressNoteGlassBreak) => glassBreak.id === otherProgressNoteGlassBreak.id,
      );

      expect(glassBreak1).toMatchObject({
        id: progressNoteGlassBreak.id,
        progressNoteId: progressNote.id,
        userId: user.id,
      });

      expect(glassBreak2).toMatchObject({
        id: otherProgressNoteGlassBreak.id,
        progressNoteId: progressNote2.id,
        userId: user.id,
      });
    });
  });

  it('resolves glass break check for progress note not requiring glass break', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const { clinic, user, patient } = await setup(txn);
      const user2 = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const progressNoteTemplate2 = await ProgressNoteTemplate.create(
        {
          title: 'title',
        },
        txn,
      );

      const progressNote2 = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate2.id,
        },
        txn,
      );

      const query = `{
        progressNoteGlassBreakCheck(progressNoteId: "${progressNote2.id}") {
          progressNoteId
          isGlassBreakNotNeeded
        }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions: 'blue',
        userId: user2.id,
        txn,
      });

      expect(result.data!.progressNoteGlassBreakCheck).toMatchObject({
        progressNoteId: progressNote2.id,
        isGlassBreakNotNeeded: true,
      });
    });
  });

  it('resolves glass break check for progress note written by user', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const { user, progressNote } = await setup(txn);

      const query = `{
        progressNoteGlassBreakCheck(progressNoteId: "${progressNote.id}") {
          progressNoteId
          isGlassBreakNotNeeded
        }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions: 'blue',
        userId: user.id,
        txn,
      });

      expect(result.data!.progressNoteGlassBreakCheck).toMatchObject({
        progressNoteId: progressNote.id,
        isGlassBreakNotNeeded: true,
      });
    });
  });

  it('resolves glass break check for progress note requiring glass break', async () => {
    await transaction(ProgressNoteGlassBreak.knex(), async txn => {
      const { clinic, progressNote } = await setup(txn);
      const user2 = await User.create(createMockUser(11, clinic.id, userRole), txn);

      const query = `{
        progressNoteGlassBreakCheck(progressNoteId: "${progressNote.id}") {
          progressNoteId
          isGlassBreakNotNeeded
        }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions: 'blue',
        userId: user2.id,
        txn,
      });

      expect(result.data!.progressNoteGlassBreakCheck).toMatchObject({
        progressNoteId: progressNote.id,
        isGlassBreakNotNeeded: false,
      });
    });
  });
});
