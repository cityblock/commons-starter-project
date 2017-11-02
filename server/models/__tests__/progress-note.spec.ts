import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Patient from '../patient';
import ProgressNote from '../progress-note';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'physician';

describe('progress note model', () => {
  let db: Db;
  let progressNoteTemplate: ProgressNoteTemplate;
  let user: User;
  let patient: Patient;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    patient = await createPatient(createMockPatient(123), user.id);
    progressNoteTemplate = await ProgressNoteTemplate.create({
      title: 'title',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and retrieves progress note', async () => {
    const createdNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    const progressNote = await ProgressNote.get(createdNote.id);
    expect(progressNote).toMatchObject({
      id: progressNote.id,
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });

    expect(progressNote.createdAt).not.toBeNull();
    expect(progressNote.completedAt).toBeNull();
    expect(progressNote.updatedAt).not.toBeNull();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = 'fakeId';
    await expect(ProgressNote.get(fakeId)).rejects.toMatch('No such progress note: fakeId');
  });

  it('gets progress notes for a patient', async () => {
    const createdNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    const progressNotes = await ProgressNote.getAllForPatient(patient.id);
    expect(progressNotes).toEqual([createdNote]);
  });

  it('completes a progress note', async () => {
    const progressNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    expect(progressNote.createdAt).not.toBeNull();
    expect(progressNote.completedAt).toBeNull();
    expect(progressNote.updatedAt).not.toBeNull();

    const completedNote = await ProgressNote.complete(progressNote.id);
    expect(completedNote.completedAt).not.toBeNull();
  });

  it('deletes a progress note', async () => {
    const progressNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    expect(progressNote.deletedAt).toBeNull();
    const deletedNote = await ProgressNote.delete(progressNote.id);
    expect(deletedNote.deletedAt).not.toBeNull();
  });

  it('auto opens a progress note if necessary', async () => {
    // The patient should not have any progress notes yet
    const firstFetchedProgressNotes = await ProgressNote.getAllForPatient(patient.id);
    expect(firstFetchedProgressNotes.length).toEqual(0);

    // autoOpenIfRequired should open a note
    const autoProgressNote = await ProgressNote.autoOpenIfRequired({
      userId: user.id,
      patientId: patient.id,
    });
    const secondFetchedProgressNotes = await ProgressNote.getAllForPatient(patient.id);
    expect(secondFetchedProgressNotes.length).toEqual(1);

    // autoOpenIfRequired should not open another note
    const secondAutoProgressNote = await ProgressNote.autoOpenIfRequired({
      userId: user.id,
      patientId: patient.id,
    });
    const thirdFetchedProgressNotes = await ProgressNote.getAllForPatient(patient.id);
    expect(thirdFetchedProgressNotes.length).toEqual(1);
    expect(secondAutoProgressNote.id).toEqual(autoProgressNote.id);
  });
});
