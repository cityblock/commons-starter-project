import { subHours } from 'date-fns';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import ProgressNote from '../progress-note';
import ProgressNoteGlassBreak from '../progress-note-glass-break';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'admin' as UserRole;
const reason = 'Other';
const note = 'New phone who dis';

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

  return { user, patient, progressNote, progressNoteTemplate, clinic };
}

describe('Progress Note Glass Break Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(ProgressNote.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get a progress note glass break', async () => {
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

  it('throws an error if the progress note glass break does not exist for given id', async () => {
    const fakeId = uuid();
    const error = `No such progress note glass break: ${fakeId}`;
    await expect(ProgressNoteGlassBreak.get(fakeId, txn)).rejects.toMatch(error);
  });

  it('validates a recent glass break', async () => {
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

    expect(
      await ProgressNoteGlassBreak.validateGlassBreak(
        progressNoteGlassBreak.id,
        user.id,
        progressNote.id,
        txn,
      ),
    ).toBe(true);
  });

  it('invalidates a glass break with a fake id', async () => {
    const { user, progressNote } = await setup(txn);

    const fakeId = uuid();
    const error =
      'You must break the glass again to view this progress note. Please refresh the page.';
    await expect(
      ProgressNoteGlassBreak.validateGlassBreak(fakeId, user.id, progressNote.id, txn),
    ).rejects.toMatch(error);
  });

  it('invalidates a glass break that was created too long ago', async () => {
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

    const error =
      'You must break the glass again to view this progress note. Please refresh the page.';

    await expect(
      ProgressNoteGlassBreak.validateGlassBreak(
        patientGlassBreak.id,
        user.id,
        progressNote.id,
        txn,
      ),
    ).rejects.toMatch(error);
  });

  it('gets all patient glass breaks for the current user session', async () => {
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
