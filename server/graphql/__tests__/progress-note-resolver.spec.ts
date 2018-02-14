import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import ProgressNote from '../../models/progress-note';
import ProgressNoteTemplate from '../../models/progress-note-template';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  progressNoteTemplate: ProgressNoteTemplate;
  user: User;
  patient: Patient;
  clinic: Clinic;
}
const userRole = 'admin';

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

describe('progress note resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('fetches a progress note', async () => {
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
      const query = `{
        progressNote(
          progressNoteId: "${progressNote.id}"
        ) { id } }`;
      const result = await graphql(schema, query, null, { userRole, userId: user.id, txn });
      expect(cloneDeep(result.data!.progressNote)).toMatchObject({
        id: progressNote.id,
      });
    });
  });

  it('creates a progress note', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user } = await setup(txn);

      const mutation = `mutation {
        progressNoteCreate(input:
          { patientId: "${patient.id}" }
        ) {
          userId, patientId
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id, txn });
      expect(cloneDeep(result.data!.progressNoteCreate)).toMatchObject({
        userId: user.id,
        patientId: patient.id,
      });
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
      const mutation = `mutation {
        progressNoteComplete(input: {
          progressNoteId: "${progressNote.id}"
        }) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id, txn });
      expect(cloneDeep(result.data!.progressNoteComplete)).toMatchObject({
        id: progressNote.id,
      });
    });
  });

  it('edits a progress note', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);

      const progressNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
          needsSupervisorReview: true,
        },
        txn,
      );
      expect(progressNote.needsSupervisorReview).toBeTruthy();
      const progressNoteTemplate2 = await ProgressNoteTemplate.create(
        {
          title: 'title 2',
        },
        txn,
      );
      const mutation = `mutation {
        progressNoteEdit(input: {
          progressNoteId: "${progressNote.id}"
          progressNoteTemplateId: "${progressNoteTemplate2.id}"
          needsSupervisorReview: false
        }) {
          id
          progressNoteTemplate { id }
          needsSupervisorReview
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id, txn });
      expect(cloneDeep(result.data!.progressNoteEdit.progressNoteTemplate.id)).toEqual(
        progressNoteTemplate2.id,
      );
      expect(cloneDeep(result.data!.progressNoteEdit.needsSupervisorReview)).toBeFalsy();
    });
  });

  it('adds supervisor notes', async () => {
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
      await ProgressNote.complete(progressNote.id, txn);
      const supervisorNotes = 'looks good';
      const mutation = `mutation {
        progressNoteAddSupervisorNotes(input: {
          progressNoteId: "${progressNote.id}"
          supervisorNotes: "${supervisorNotes}"
        }) {
          id
          supervisorNotes
          reviewedBySupervisorAt
          supervisor { id }
          supervisorId
        }
      }`;
      const resultWithError = await graphql(schema, mutation, null, {
        userRole,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(resultWithError.errors![0].message)).toEqual(
        'you are not the supervisor permitted to review this progress note',
      );

      const result = await graphql(schema, mutation, null, {
        userRole,
        userId: supervisor.id,
        txn,
      });

      expect(cloneDeep(result.data!.progressNoteAddSupervisorNotes.supervisorNotes)).toEqual(
        supervisorNotes,
      );
      expect(
        cloneDeep(result.data!.progressNoteAddSupervisorNotes.reviewedBySupervisorAt),
      ).toBeNull();
      expect(cloneDeep(result.data!.progressNoteAddSupervisorNotes.supervisor.id)).toEqual(
        supervisor.id,
      );
    });
  });

  it('complete supervisor review', async () => {
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
      await ProgressNote.complete(progressNote.id, txn);
      await ProgressNote.addSupervisorNotes(progressNote.id, 'notes!', txn);
      const mutation = `mutation {
        progressNoteCompleteSupervisorReview(input: {
          progressNoteId: "${progressNote.id}"
        }) {
          id
          supervisorNotes
          reviewedBySupervisorAt
          supervisor { id }
          supervisorId
        }
      }`;
      const resultWithError = await graphql(schema, mutation, null, {
        userRole,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(resultWithError.errors![0].message)).toEqual(
        'you are not the supervisor permitted to review this progress note',
      );

      const result = await graphql(schema, mutation, null, {
        userRole,
        userId: supervisor.id,
        txn,
      });

      expect(cloneDeep(result.data!.progressNoteCompleteSupervisorReview.supervisorNotes)).toEqual(
        'notes!',
      );
      expect(
        cloneDeep(result.data!.progressNoteCompleteSupervisorReview.reviewedBySupervisorAt),
      ).not.toBeNull();
      expect(cloneDeep(result.data!.progressNoteCompleteSupervisorReview.supervisor.id)).toEqual(
        supervisor.id,
      );
    });
  });

  describe('progress notes', () => {
    it('returns progress notes for patient', async () => {
      await transaction(ProgressNote.knex(), async txn => {
        const { patient, user, progressNoteTemplate } = await setup(txn);

        const progressNote1 = await ProgressNote.create(
          {
            patientId: patient.id,
            userId: user.id,
            progressNoteTemplateId: progressNoteTemplate.id,
          },
          txn,
        );
        const progressNote2 = await ProgressNote.create(
          {
            patientId: patient.id,
            userId: user.id,
            progressNoteTemplateId: progressNoteTemplate.id,
          },
          txn,
        );

        const query = `{
          progressNotesForPatient(patientId: "${patient.id}", completed: false) { id }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.progressNotesForPatient)).toMatchObject([
          {
            id: progressNote1.id,
          },
          {
            id: progressNote2.id,
          },
        ]);
      });
    });

    it('returns progress notes for current user', async () => {
      await transaction(ProgressNote.knex(), async txn => {
        const { patient, user, progressNoteTemplate } = await setup(txn);

        const progressNote1 = await ProgressNote.create(
          {
            patientId: patient.id,
            userId: user.id,
            progressNoteTemplateId: progressNoteTemplate.id,
          },
          txn,
        );
        const progressNote2 = await ProgressNote.create(
          {
            patientId: patient.id,
            userId: user.id,
            progressNoteTemplateId: progressNoteTemplate.id,
          },
          txn,
        );

        const query = `{
          progressNotesForCurrentUser(completed: false) { id }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.progressNotesForCurrentUser)).toMatchObject([
          {
            id: progressNote1.id,
          },
          {
            id: progressNote2.id,
          },
        ]);
      });
    });

    it('returns progress notes for supervisor', async () => {
      await transaction(ProgressNote.knex(), async txn => {
        const { patient, user, clinic, progressNoteTemplate } = await setup(txn);
        const user2 = await User.create(
          createMockUser(12, clinic.id, userRole, 'supervisor@b.com'),
          txn,
        );

        const progressNote1 = await ProgressNote.create(
          {
            patientId: patient.id,
            userId: user.id,
            progressNoteTemplateId: progressNoteTemplate.id,
            supervisorId: user2.id,
            needsSupervisorReview: true,
          },
          txn,
        );
        await ProgressNote.complete(progressNote1.id, txn);
        const query = `{
          progressNotesForSupervisorReview { id }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          userId: user2.id,
          txn,
        });
        expect(cloneDeep(result.data!.progressNotesForSupervisorReview)).toMatchObject([
          {
            id: progressNote1.id,
          },
        ]);
      });
    });
  });
});
