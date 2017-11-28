import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import ProgressNote from '../progress-note';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'physician';

describe('progress note model', () => {
  let progressNoteTemplate: ProgressNoteTemplate;
  let user: User;
  let patient: Patient;
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
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

    expect(progressNote.createdAt).not.toBeFalsy();
    expect(progressNote.completedAt).toBeFalsy();
    expect(progressNote.updatedAt).not.toBeFalsy();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(ProgressNote.get(fakeId)).rejects.toMatch(`No such progress note: ${fakeId}`);
  });

  it('gets progress notes for a patient', async () => {
    const createdNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    const progressNotes = await ProgressNote.getAllForPatient(patient.id, false);
    expect(progressNotes).toEqual([createdNote]);
  });

  it('updates a progress note', async () => {
    const progressNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    const progressNoteTemplate2 = await ProgressNoteTemplate.create({
      title: 'title 2',
    });
    const startedAt = new Date().toISOString();
    const location = 'cool location';
    const updatedNote = await ProgressNote.update(progressNote.id, {
      progressNoteTemplateId: progressNoteTemplate2.id,
      startedAt,
      location,
    });
    expect(updatedNote.progressNoteTemplateId).toBe(progressNoteTemplate2.id);
    expect(updatedNote.startedAt).not.toBeFalsy();
    expect(updatedNote.location).toBe(location);
  });

  it('completes a progress note', async () => {
    const progressNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    expect(progressNote.createdAt).not.toBeFalsy();
    expect(progressNote.completedAt).toBeFalsy();
    expect(progressNote.updatedAt).not.toBeFalsy();

    const completedNote = await ProgressNote.complete(progressNote.id);
    expect(completedNote.completedAt).not.toBeFalsy();

    // fetches completed progress note
    const fetchedProgressNotes = await ProgressNote.getAllForPatient(patient.id, true);
    expect(fetchedProgressNotes.length).toEqual(1);
    expect(fetchedProgressNotes[0].id).toEqual(completedNote.id);
  });

  it('deletes a progress note', async () => {
    const progressNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    expect(progressNote.deletedAt).toBeFalsy();
    const deletedNote = await ProgressNote.delete(progressNote.id);
    expect(deletedNote.deletedAt).not.toBeFalsy();
  });

  it('auto opens a progress note if necessary', async () => {
    // The patient should not have any progress notes yet
    const firstFetchedProgressNotes = await ProgressNote.getAllForPatient(patient.id, false);
    expect(firstFetchedProgressNotes.length).toEqual(0);

    // autoOpenIfRequired should open a note
    const autoProgressNote = await ProgressNote.autoOpenIfRequired({
      userId: user.id,
      patientId: patient.id,
    });
    const secondFetchedProgressNotes = await ProgressNote.getAllForPatient(patient.id, false);
    expect(secondFetchedProgressNotes.length).toEqual(1);

    // autoOpenIfRequired should not open another note
    const secondAutoProgressNote = await ProgressNote.autoOpenIfRequired({
      userId: user.id,
      patientId: patient.id,
    });
    const thirdFetchedProgressNotes = await ProgressNote.getAllForPatient(patient.id, false);
    expect(thirdFetchedProgressNotes.length).toEqual(1);
    expect(secondAutoProgressNote.id).toEqual(autoProgressNote.id);
  });
});
