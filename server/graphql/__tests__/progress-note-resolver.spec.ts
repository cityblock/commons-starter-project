import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import ProgressNote from '../../models/progress-note';
import ProgressNoteTemplate from '../../models/progress-note-template';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('progress note resolver', () => {
  let db: Db;
  const userRole = 'admin';
  let progressNoteTemplate: ProgressNoteTemplate;
  let user: User;
  let patient: Patient;
  let clinic: Clinic;

  beforeEach(async () => {
    db = await Db.get();
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

  it('fetches a progress note', async () => {
    const progressNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    const query = `{
        progressNote(
          progressNoteId: "${progressNote.id}"
        ) { id } }`;
    const result = await graphql(schema, query, null, { userRole, userId: user.id });
    expect(cloneDeep(result.data!.progressNote)).toMatchObject({
      id: progressNote.id,
    });
  });

  it('creates a progress note', async () => {
    const mutation = `mutation {
        progressNoteGetOrCreate(input:
          { patientId: "${patient.id}" }
        ) {
          userId, patientId
        }
      }`;
    const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
    expect(cloneDeep(result.data!.progressNoteGetOrCreate)).toMatchObject({
      userId: user.id,
      patientId: patient.id,
    });
  });

  it('completes a progress note', async () => {
    const progressNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    const mutation = `mutation {
        progressNoteComplete(input: {
          progressNoteId: "${progressNote.id}"
        }) {
          id
        }
      }`;
    const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
    expect(cloneDeep(result.data!.progressNoteComplete)).toMatchObject({
      id: progressNote.id,
    });
  });

  it('edits a progress note', async () => {
    const progressNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    const progressNoteTemplate2 = await ProgressNoteTemplate.create({
      title: 'title 2',
    });
    const mutation = `mutation {
        progressNoteEdit(input: {
          progressNoteId: "${progressNote.id}"
          progressNoteTemplateId: "${progressNoteTemplate2.id}"
        }) {
          id
          progressNoteTemplate { id }
        }
      }`;
    const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
    expect(cloneDeep(result.data!.progressNoteEdit.progressNoteTemplate.id)).toEqual(
      progressNoteTemplate2.id,
    );
  });

  describe('progress notes', () => {
    it('returns progress notes for patient', async () => {
      const progressNote1 = await ProgressNote.create({
        patientId: patient.id,
        userId: user.id,
        progressNoteTemplateId: progressNoteTemplate.id,
      });
      const progressNote2 = await ProgressNote.create({
        patientId: patient.id,
        userId: user.id,
        progressNoteTemplateId: progressNoteTemplate.id,
      });

      const query = `{
        progressNotesForPatient(patientId: "${patient.id}") { id }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
        userId: user.id,
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
});
