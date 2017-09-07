import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Concern from '../../models/concern';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient concern resolver', () => {
  let db: Db;
  let concern: Concern;
  let patient: Patient;
  let user: User;
  const userRole = 'admin';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    concern = await Concern.create({
      title: 'Housing',
    });
    user = await User.create({
      email: 'care@care.com',
      userRole,
      homeClinicId: '1',
    });
    patient = await createPatient(createMockPatient(123), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient concern', () => {
    it('fetches a patient concern', async () => {
      const patientConcern = await PatientConcern.create({
        patientId: patient.id,
        concernId: concern.id,
        order: 1,
      });
      const query = `{ patientConcern(patientConcernId: "${patientConcern.id}") {
        concernId, patientId, order
       } }`;
      const result = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result.data!.patientConcern)).toMatchObject({
        patientId: patient.id,
        concernId: concern.id,
        order: 1,
      });
    });
  });

  describe('patient concern create', () => {
    it('creates a patient concern', async () => {
      const mutation = `mutation {
        patientConcernCreate(
          input: { patientId: "${patient.id}", concernId: "${concern.id}" }
        ) {
          patientId, concernId, order
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.patientConcernCreate)).toMatchObject({
        patientId: patient.id,
        concernId: concern.id,
        order: 1,
      });
    });
  });

  describe('patient concern Edit', () => {
    it('edits a patient concern', async () => {
      const patientConcern = await PatientConcern.create({
        patientId: patient.id,
        concernId: concern.id,
        order: 1,
      });
      const mutation = `mutation {
        patientConcernEdit(input: { order: 2, patientConcernId: "${patientConcern.id}" }) {
          order
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.patientConcernEdit)).toMatchObject({
        order: 2,
      });
    });
  });

  describe('patient concern delete', () => {
    it('deletes a patient concern', async () => {
      const patientConcern = await PatientConcern.create({
        patientId: patient.id,
        concernId: concern.id,
        order: 1,
      });
      const mutation = `mutation {
        patientConcernDelete(input: { patientConcernId: "${patientConcern.id}" }) {
          deletedAt
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.patientConcernDelete).deletedAt).not.toBeNull();
    });
  });

  describe('patient concerns for patient', () => {
    it('returns patient concerns for patient', async () => {
      await PatientConcern.create({
        patientId: patient.id,
        concernId: concern.id,
        order: 1,
      });
      const query = `{
        patientConcerns(patientId: "${patient.id}") { concernId, order }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
      });
      expect(cloneDeep(result.data!.patientConcerns)).toMatchObject([
        {
          concernId: concern.id,
          order: 1,
        },
      ]);
    });
  });
});
