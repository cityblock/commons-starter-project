import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'physician' as UserRole;

interface ISetup {
  user: User;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  return { clinic, user };
}

describe('progress note template model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(ProgressNoteTemplate.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and retrieves progress note', async () => {
    await setup(txn);
    const createdProgressNoteTemplate = await ProgressNoteTemplate.create(
      {
        title: 'title',
      },
      txn,
    );
    const progressNoteTemplate = await ProgressNoteTemplate.get(
      createdProgressNoteTemplate.id,
      txn,
    );
    expect(progressNoteTemplate).toMatchObject({
      id: progressNoteTemplate.id,
      title: 'title',
      requiresGlassBreak: false,
    });

    expect(progressNoteTemplate.createdAt).not.toBeFalsy();
    expect(progressNoteTemplate.updatedAt).not.toBeFalsy();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(ProgressNoteTemplate.get(fakeId, txn)).rejects.toMatch(
      `No such progress note template: ${fakeId}`,
    );
  });

  it('gets all progress note template', async () => {
    const progressNoteTemplate2 = await ProgressNoteTemplate.create(
      {
        title: 'title 2',
      },
      txn,
    );
    const progressNoteTemplate1 = await ProgressNoteTemplate.create(
      {
        title: 'title 1',
      },
      txn,
    );

    const progressNotes = await ProgressNoteTemplate.getAll(txn);
    expect(progressNotes).toEqual([progressNoteTemplate1, progressNoteTemplate2]);
  });

  it('edits a progress note', async () => {
    await setup(txn);
    const progressNoteTemplate = await ProgressNoteTemplate.create(
      {
        title: 'title',
      },
      txn,
    );

    const editedDrogressNoteTemplate = await ProgressNoteTemplate.edit(
      {
        title: 'new title',
      },
      progressNoteTemplate.id,
      txn,
    );

    expect(editedDrogressNoteTemplate.title).toEqual('new title');
  });

  it('deletes a progress note template', async () => {
    await setup(txn);
    const progressNoteTemplate = await ProgressNoteTemplate.create(
      {
        title: 'title',
      },
      txn,
    );
    expect(progressNoteTemplate.deletedAt).toBeFalsy();
    const deletedNote = await ProgressNoteTemplate.delete(progressNoteTemplate.id, txn);
    expect(deletedNote.deletedAt).not.toBeFalsy();
  });
});
