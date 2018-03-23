import { subHours } from 'date-fns';
import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientGlassBreak from '../../models/patient-glass-break';
import ProgressNote from '../../models/progress-note';
import ProgressNoteGlassBreak from '../../models/progress-note-glass-break';
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
const permissions = 'green';

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
  let txn = null as any;
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('fetches a progress note', async () => {
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
    const result = await graphql(schema, query, null, {
      permissions: 'blue',
      userId: user.id,
      txn,
    });
    expect(cloneDeep(result.data!.progressNote)).toMatchObject({
      id: progressNote.id,
    });
  });

  it('blocks resolving a progress note with invalid glass break', async () => {
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
          glassBreakId: "${uuid()}"
        ) { id } }`;
    const result = await graphql(schema, query, null, {
      permissions: 'blue',
      userId: user.id,
      txn,
    });

    expect(result.errors![0].message).toBe(
      'You must break the glass again to view this progress note. Please refresh the page.',
    );
  });

  it('blocks resolving progress note with too old glass break', async () => {
    const { patient, user, progressNoteTemplate } = await setup(txn);

    const progressNote = await ProgressNote.create(
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
        reason: 'Needed for routine care',
        note: null,
      },
      txn,
    );

    await ProgressNoteGlassBreak.query(txn)
      .where({ userId: user.id, progressNoteId: progressNote.id })
      .patch({ createdAt: subHours(new Date(), 9).toISOString() });

    const query = `{
        progressNote(
          progressNoteId: "${progressNote.id}"
          glassBreakId: "${progressNoteGlassBreak.id}"
        ) { id } }`;
    const result = await graphql(schema, query, null, {
      permissions: 'blue',
      userId: user.id,
      txn,
    });

    expect(result.errors![0].message).toBe(
      'You must break the glass again to view this progress note. Please refresh the page.',
    );
  });

  it('blocks resolving progress note with no glass break when one needed', async () => {
    const { patient, user, progressNoteTemplate, clinic } = await setup(txn);
    const user2 = await User.create(
      createMockUser(12, clinic.id, userRole, 'supervisor@b.com'),
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

    const query = `{
        progressNote(
          progressNoteId: "${progressNote.id}"
        ) { id } }`;

    const result = await graphql(schema, query, null, {
      permissions: 'blue',
      userId: user2.id,
      txn,
    });
    const error = `User ${user2.id} cannot automatically break the glass for progressNote ${
      progressNote.id
    }`;

    expect(result.errors![0].message).toBe(error);
  });

  it('creates a progress note', async () => {
    const { patient, user } = await setup(txn);

    const mutation = `mutation {
        progressNoteCreate(input:
          { patientId: "${patient.id}" }
        ) {
          userId, patientId
        }
      }`;
    const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
    expect(cloneDeep(result.data!.progressNoteCreate)).toMatchObject({
      userId: user.id,
      patientId: patient.id,
    });
  });

  it('completes a progress note', async () => {
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
    const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
    expect(cloneDeep(result.data!.progressNoteComplete)).toMatchObject({
      id: progressNote.id,
    });
  });

  it('edits a progress note', async () => {
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
    const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
    expect(cloneDeep(result.data!.progressNoteEdit.progressNoteTemplate.id)).toEqual(
      progressNoteTemplate2.id,
    );
    expect(cloneDeep(result.data!.progressNoteEdit.needsSupervisorReview)).toBeFalsy();
  });

  it('adds supervisor notes', async () => {
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
      permissions,
      userId: user.id,
      txn,
    });
    expect(cloneDeep(resultWithError.errors![0].message)).toEqual(
      'you are not the supervisor permitted to review this progress note',
    );

    const result = await graphql(schema, mutation, null, {
      permissions,
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

  it('complete supervisor review', async () => {
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
      permissions,
      userId: user.id,
      txn,
    });
    expect(cloneDeep(resultWithError.errors![0].message)).toEqual(
      'you are not the supervisor permitted to review this progress note',
    );

    const result = await graphql(schema, mutation, null, {
      permissions,
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

  describe('progress notes', () => {
    it('returns progress notes for patient', async () => {
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
          progressNoteIdsForPatient(patientId: "${patient.id}", completed: false)
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const progressNoteIds = cloneDeep(result.data!.progressNoteIdsForPatient);

      expect(progressNoteIds).toContain(progressNote1.id);
      expect(progressNoteIds).toContain(progressNote2.id);
    });

    it('blocks progress notes for patient with invalid glass break', async () => {
      const { clinic, user } = await setup(txn);
      const patient2 = await createPatient(
        {
          cityblockId: 124,
          homeClinicId: clinic.id,
        },
        txn,
      );

      const query = `{
          progressNoteIdsForPatient(patientId: "${
            patient2.id
          }", completed: false, glassBreakId: "${uuid()}")
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions: 'blue',
        userId: user.id,
        txn,
      });

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('blocks progress notes for patient with too old glass break', async () => {
      const { clinic, user } = await setup(txn);
      const patient2 = await createPatient(
        {
          cityblockId: 125,
          homeClinicId: clinic.id,
        },
        txn,
      );

      const patientGlassBreak = await PatientGlassBreak.create(
        {
          userId: user.id,
          patientId: patient2.id,
          reason: 'Needed for routine care',
          note: null,
        },
        txn,
      );

      await PatientGlassBreak.query(txn)
        .where({ userId: user.id, patientId: patient2.id })
        .patch({ createdAt: subHours(new Date(), 9).toISOString() });

      const query = `{
          progressNoteIdsForPatient(patientId: "${patient2.id}", completed: false, glassBreakId: "${
        patientGlassBreak.id
      }")
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions: 'blue',
        userId: user.id,
        txn,
      });

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('returns progress notes for current user', async () => {
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
        permissions,
        userId: user.id,
        txn,
      });
      const progressNotes = cloneDeep(result.data!.progressNotesForCurrentUser);
      const progressNoteIds = progressNotes.map((progressNote: ProgressNote) => progressNote.id);
      expect(progressNoteIds).toContain(progressNote1.id);
      expect(progressNoteIds).toContain(progressNote2.id);
    });

    it('returns progress notes for supervisor', async () => {
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
        permissions,
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
