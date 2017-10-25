import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Patient from '../patient';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'physician';

describe('progress note template model', () => {
  let db: Db;
  let user: User;
  let patient: Patient;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    patient = await createPatient(createMockPatient(123), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and retrieves progress note', async () => {
    const createdProgressNoteTemplate = await ProgressNoteTemplate.create({
      title: 'title',
    });
    const progressNoteTemplate = await ProgressNoteTemplate.get(createdProgressNoteTemplate.id);
    expect(progressNoteTemplate).toMatchObject({
      id: progressNoteTemplate.id,
      title: 'title',
    });

    expect(progressNoteTemplate.createdAt).not.toBeNull();
    expect(progressNoteTemplate.updatedAt).not.toBeNull();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = 'fakeId';
    await expect(ProgressNoteTemplate.get(fakeId)).rejects.toMatch(
      'No such progress note template: fakeId',
    );
  });

  it('gets all progress note template', async () => {
    const progressNoteTemplate1 = await ProgressNoteTemplate.create({
      title: 'title 1',
    });
    const progressNoteTemplate2 = await ProgressNoteTemplate.create({
      title: 'title 2',
    });

    const progressNotes = await ProgressNoteTemplate.getAll();
    expect(progressNotes).toEqual([
      progressNoteTemplate1,
      progressNoteTemplate2,
    ]);
  });

  it('edits a progress note', async () => {
    const progressNoteTemplate = await ProgressNoteTemplate.create({
      title: 'title',
    });

    const editedDrogressNoteTemplate = await ProgressNoteTemplate.edit({
      title: 'new title',
    }, progressNoteTemplate.id);

    expect(editedDrogressNoteTemplate.title).toEqual('new title');
  });

  it('deletes a progress note template', async () => {
    const progressNoteTemplate = await ProgressNoteTemplate.create({
      title: 'title',
    });
    expect(progressNoteTemplate.deletedAt).toBeNull();
    const deletedNote = await ProgressNoteTemplate.delete(progressNoteTemplate.id);
    expect(deletedNote.deletedAt).not.toBeNull();
  });
});