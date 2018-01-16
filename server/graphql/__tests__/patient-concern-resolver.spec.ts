import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  concern: Concern;
  patient: Patient;
  user: User;
}

const userRole = 'admin';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
  const concern = await Concern.create({ title: 'Housing' }, txn);
  const patient = await createPatient(createMockPatient(123, clinic.id), user.id, txn);

  return {
    user,
    concern,
    patient,
  };
}

describe('patient concern resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient concern', () => {
    it('fetches a patient concern', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, concern, user } = await setup(txn);
        const patientConcern = await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern.id,
            order: 1,
            userId: user.id,
          },
          txn,
        );
        const query = `{ patientConcern(patientConcernId: "${patientConcern.id}") {
          concernId, patientId, order
        } }`;
        const result = await graphql(schema, query, null, { userRole, txn });
        expect(cloneDeep(result.data!.patientConcern)).toMatchObject({
          patientId: patient.id,
          concernId: concern.id,
          order: 1,
        });
      });
    });
  });

  describe('patient concern create', () => {
    it('creates a patient concern', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, concern, user } = await setup(txn);
        const mutation = `mutation {
          patientConcernCreate(
            input: { patientId: "${patient.id}", concernId: "${concern.id}" }
          ) {
            patientId, concernId, order
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, userId: user.id, txn });
        expect(cloneDeep(result.data!.patientConcernCreate)).toMatchObject({
          patientId: patient.id,
          concernId: concern.id,
          order: 1,
        });
      });
    });
  });

  describe('patient concern edit', () => {
    it('edits a patient concern', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, concern, user } = await setup(txn);
        const patientConcern = await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern.id,
            order: 1,
            userId: user.id,
          },
          txn,
        );
        const mutation = `mutation {
          patientConcernEdit(input: { order: 2, patientConcernId: "${patientConcern.id}" }) {
            order
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, userId: user.id, txn });
        expect(cloneDeep(result.data!.patientConcernEdit)).toMatchObject({
          order: 2,
        });
      });
    });
  });

  describe('patient concern bulk edit', () => {
    it('bulk edits patient concerns', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, concern, user } = await setup(txn);
        const patientConcern = await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern.id,
            order: 1,
            userId: user.id,
          },
          txn,
        );
        const concern2 = await Concern.create({ title: 'Food insecurity' }, txn);
        const patientConcern2 = await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern2.id,
            order: 2,
            userId: user.id,
          },
          txn,
        );
        const concern3 = await Concern.create({ title: 'Mental illness' }, txn);
        const patientConcern3 = await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern3.id,
            order: 3,
            userId: user.id,
          },
          txn,
        );

        const mutation = `mutation {
          patientConcernBulkEdit(input: {
            patientConcerns: [
              { id: "${patientConcern.id}", order: 2 },
              { id: "${patientConcern2.id}", order: 1 }
            ],
            patientId: "${patient.id}"
          }) {
            id
            order
            concernId
          }
        }`;

        const result = await graphql(schema, mutation, null, { userRole, userId: user.id, txn });

        expect(result.data!.patientConcernBulkEdit.length).toBe(3);
        expect(result.data!.patientConcernBulkEdit[0]).toMatchObject({
          id: patientConcern2.id,
          order: 1,
          concernId: concern2.id,
        });
        expect(result.data!.patientConcernBulkEdit[1]).toMatchObject({
          id: patientConcern.id,
          order: 2,
          concernId: concern.id,
        });
        expect(result.data!.patientConcernBulkEdit[2]).toMatchObject({
          id: patientConcern3.id,
          order: 3,
          concernId: concern3.id,
        });
      });
    });
  });

  describe('patient concern delete', () => {
    it('deletes a patient concern', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, concern, user } = await setup(txn);
        const patientConcern = await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern.id,
            order: 1,
            userId: user.id,
          },
          txn,
        );
        const mutation = `mutation {
          patientConcernDelete(input: { patientConcernId: "${patientConcern.id}" }) {
            deletedAt
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, userId: user.id, txn });
        expect(cloneDeep(result.data!.patientConcernDelete).deletedAt).not.toBeFalsy();
      });
    });
  });

  describe('patient concerns for patient', () => {
    it('returns patient concerns for patient', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, concern, user } = await setup(txn);
        await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern.id,
            order: 1,
            userId: user.id,
          },
          txn,
        );
        const query = `{
          patientConcerns(patientId: "${patient.id}") { concernId, order }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          txn,
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
});
