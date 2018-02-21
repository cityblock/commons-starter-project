import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import ProgressNote from '../progress-note';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  progressNoteTemplate: ProgressNoteTemplate;
  user: User;
  patient: Patient;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const progressNoteTemplate = await ProgressNoteTemplate.create(
    {
      title: 'title',
    },
    txn,
  );
  return { clinic, user, patient, progressNoteTemplate };
}

describe('progress note model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and retrieves progress note', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);
      const createdNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      const progressNote = await ProgressNote.get(createdNote.id, txn);
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
  });

  it('throws an error when getting an invalid id', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const fakeId = uuid();
      await expect(ProgressNote.get(fakeId, txn)).rejects.toMatch(
        `No such progress note: ${fakeId}`,
      );
    });
  });

  it('gets progress notes for a patient', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);
      const createdNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      const progressNotes = await ProgressNote.getAllForPatient(patient.id, false, txn);
      expect(progressNotes).toEqual([createdNote]);
    });
  });

  it('gets progress notes for a user', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);
      const createdNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      const progressNotes = await ProgressNote.getAllForUser(user.id, false, txn);
      expect(progressNotes).toEqual([createdNote]);
    });
  });

  it('gets a count of progress notes for a user', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);

      const progressNoteCount1 = await ProgressNote.getCountForPatient(patient.id, txn);
      expect(progressNoteCount1).toEqual(0);

      await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );

      const progressNoteCount2 = await ProgressNote.getCountForPatient(patient.id, txn);
      expect(progressNoteCount2).toEqual(1);
    });
  });

  it('gets progress for supervisor review', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate, clinic } = await setup(txn);
      const supervisor = await User.create(
        createMockUser(12, clinic.id, userRole, 'supervisor@b.com'),
        txn,
      );
      // Uncompleted progress note in need of supervisor review
      await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
          supervisorId: supervisor.id,
          needsSupervisorReview: true,
        },
        txn,
      );

      // Completed progress note in need of supervisor review
      const completedProgressNoteInNeedOfSupervisorReview = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
          supervisorId: supervisor.id,
          needsSupervisorReview: true,
        },
        txn,
      );
      await ProgressNote.complete(completedProgressNoteInNeedOfSupervisorReview.id, txn);

      // Completed progress note with supervisor Id but not in need of supervisor review
      const completedProgressNoteWithSupervisorId = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
          supervisorId: supervisor.id,
          needsSupervisorReview: false,
        },
        txn,
      );
      await ProgressNote.complete(completedProgressNoteWithSupervisorId.id, txn);

      const progressNotes = await ProgressNote.getProgressNotesForSupervisorReview(
        supervisor.id,
        txn,
      );
      expect(progressNotes.length).toEqual(1);
      expect(progressNotes[0].id).toEqual(completedProgressNoteInNeedOfSupervisorReview.id);
    });
  });

  it('updates a progress note', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);

      const progressNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      const progressNoteTemplate2 = await ProgressNoteTemplate.create(
        {
          title: 'title 2',
        },
        txn,
      );
      const startedAt = new Date().toISOString();
      const location = 'cool location';
      const updatedNote = await ProgressNote.update(
        progressNote.id,
        {
          progressNoteTemplateId: progressNoteTemplate2.id,
          startedAt,
          location,
        },
        txn,
      );
      expect(updatedNote.progressNoteTemplateId).toBe(progressNoteTemplate2.id);
      expect(updatedNote.startedAt).not.toBeFalsy();
      expect(updatedNote.location).toBe(location);
    });
  });

  it('adds supervisor notes', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate, clinic } = await setup(txn);

      const supervisorNotes = 'looks great';
      const supervisor = await User.create(
        createMockUser(12, clinic.id, userRole, 'supervisor@b.com'),
        txn,
      );
      const progressNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
          needsSupervisorReview: true,
          supervisorId: supervisor.id,
        },
        txn,
      );
      expect(progressNote.reviewedBySupervisorAt).toBeNull();
      await ProgressNote.complete(progressNote.id, txn);
      const reviewedNote = await ProgressNote.addSupervisorNotes(
        progressNote.id,
        supervisorNotes,
        txn,
      );
      expect(reviewedNote.supervisorNotes).toBe(supervisorNotes);
      expect(reviewedNote.reviewedBySupervisorAt).toBeNull();

      const completedNote = await ProgressNote.completeSupervisorReview(progressNote.id, txn);
      expect(completedNote.reviewedBySupervisorAt).not.toBeNull();
    });
  });

  it('cannot add review to uncompleted progress note', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate, clinic } = await setup(txn);

      const supervisorNotes = 'looks great';
      const supervisor = await User.create(
        createMockUser(12, clinic.id, userRole, 'supervisor@b.com'),
        txn,
      );
      const progressNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
          needsSupervisorReview: true,
          supervisorId: supervisor.id,
        },
        txn,
      );
      expect(progressNote.reviewedBySupervisorAt).toBeNull();

      await expect(
        ProgressNote.addSupervisorNotes(progressNote.id, supervisorNotes, txn),
      ).rejects.toMatch(`Progress note not yet completed: ${progressNote.id}`);
    });
  });

  it('completes a progress note', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);

      const progressNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      expect(progressNote.createdAt).not.toBeFalsy();
      expect(progressNote.completedAt).toBeFalsy();
      expect(progressNote.updatedAt).not.toBeFalsy();

      const completedNote = await ProgressNote.complete(progressNote.id, txn);
      expect(completedNote.completedAt).not.toBeFalsy();

      // fetches completed progress note by patient
      const fetchedProgressNotesForPatient = await ProgressNote.getAllForPatient(
        patient.id,
        true,
        txn,
      );
      expect(fetchedProgressNotesForPatient.length).toEqual(1);
      expect(fetchedProgressNotesForPatient[0].id).toEqual(completedNote.id);

      // fetches completed progress note by user
      const fetchedProgressNotesForUser = await ProgressNote.getAllForUser(user.id, true, txn);
      expect(fetchedProgressNotesForUser.length).toEqual(1);
      expect(fetchedProgressNotesForUser[0].id).toEqual(completedNote.id);
    });
  });

  it('cannot complete progress note without supervisor review', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate, clinic } = await setup(txn);

      const supervisor = await User.create(
        createMockUser(12, clinic.id, userRole, 'supervisor@b.com'),
        txn,
      );
      const progressNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
          needsSupervisorReview: true,
          supervisorId: supervisor.id,
        },
        txn,
      );
      expect(progressNote.reviewedBySupervisorAt).toBeNull();

      await expect(ProgressNote.completeSupervisorReview(progressNote.id, txn)).rejects.toMatch(
        `Progress note not yet completed or missing supervisor notes: ${progressNote.id}`,
      );
    });
  });

  it('deletes a progress note', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);

      const progressNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      expect(progressNote.deletedAt).toBeFalsy();
      const deletedNote = await ProgressNote.delete(progressNote.id, txn);
      expect(deletedNote.deletedAt).not.toBeFalsy();
    });
  });

  it('auto opens a progress note if necessary', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user } = await setup(txn);

      // The patient should not have any progress notes yet
      const firstFetchedProgressNotes = await ProgressNote.getAllForPatient(patient.id, false, txn);
      expect(firstFetchedProgressNotes.length).toEqual(0);

      // autoOpenIfRequired should open a note
      const autoProgressNote = await ProgressNote.autoOpenIfRequired(
        {
          userId: user.id,
          patientId: patient.id,
        },
        txn,
      );
      const secondFetchedProgressNotes = await ProgressNote.getAllForPatient(
        patient.id,
        false,
        txn,
      );
      expect(secondFetchedProgressNotes.length).toEqual(1);

      // autoOpenIfRequired should not open another note
      const secondAutoProgressNote = await ProgressNote.autoOpenIfRequired(
        {
          userId: user.id,
          patientId: patient.id,
        },
        txn,
      );
      const thirdFetchedProgressNotes = await ProgressNote.getAllForPatient(patient.id, false, txn);
      expect(thirdFetchedProgressNotes.length).toEqual(1);
      expect(secondAutoProgressNote.id).toEqual(autoProgressNote.id);
    });
  });

  it('gets patient id for a given progress note', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);
      const createdNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );

      const progressNote = await ProgressNote.get(createdNote.id, txn);
      expect(progressNote).toMatchObject({
        id: progressNote.id,
        patientId: patient.id,
        userId: user.id,
        progressNoteTemplateId: progressNoteTemplate.id,
      });

      const fetchedPatientId = await ProgressNote.getPatientIdForResource(progressNote.id, txn);

      expect(fetchedPatientId).toBe(patient.id);
    });
  });

  it('creates and retrieves progress note for glass break', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);
      const createdNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      await ProgressNote.complete(createdNote.id, txn);
      const progressNote = await ProgressNote.getForGlassBreak(createdNote.id, txn);

      expect(progressNote).toMatchObject({
        id: progressNote.id,
        patientId: patient.id,
        userId: user.id,
        progressNoteTemplateId: progressNoteTemplate.id,
      });

      expect(progressNote.progressNoteTemplate).toBeTruthy();
    });
  });

  it('throws an error when getting an invalid id', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const fakeId = uuid();
      await expect(ProgressNote.getForGlassBreak(fakeId, txn)).rejects.toMatch(
        `No such progress note: ${fakeId}`,
      );
    });
  });
});
