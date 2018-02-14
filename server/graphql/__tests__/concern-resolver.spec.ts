import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import DiagnosisCode from '../../models/diagnosis-code';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';
const permissions = 'green';

interface ISetup {
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  return { user };
}

describe('concern resolver', () => {
  let db: Db;
  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve concern', () => {
    it('fetches a concern', async () => {
      await transaction(Concern.knex(), async txn => {
        const { user } = await setup(txn);
        const concern = await Concern.create({ title: 'Housing' }, txn);
        const query = `{ concern(concernId: "${concern.id}") { title } }`;
        const result = await graphql(schema, query, null, { permissions, userId: user.id, txn });
        expect(cloneDeep(result.data!.concern)).toMatchObject({
          title: 'Housing',
        });
      });
    });
  });

  describe('concern create', () => {
    it('creates a concern', async () => {
      await transaction(Concern.knex(), async txn => {
        const { user } = await setup(txn);
        const mutation = `mutation {
          concernCreate(input: { title: "Housing" }) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
        expect(cloneDeep(result.data!.concernCreate)).toMatchObject({
          title: 'Housing',
        });
      });
    });
  });

  describe('concern edit', () => {
    it('edits a concern', async () => {
      await transaction(Concern.knex(), async txn => {
        const { user } = await setup(txn);
        const concern = await Concern.create({ title: 'housing' }, txn);
        const mutation = `mutation {
          concernEdit(input: { title: "Medical", concernId: "${concern.id}" }) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
        expect(cloneDeep(result.data!.concernEdit)).toMatchObject({
          title: 'Medical',
        });
      });
    });
  });

  describe('concern delete', () => {
    it('deletes a concern', async () => {
      await transaction(Concern.knex(), async txn => {
        const { user } = await setup(txn);
        const concern = await Concern.create({ title: 'housing' }, txn);
        const mutation = `mutation {
          concernDelete(input: { concernId: "${concern.id}" }) {
            title, deletedAt
          }
        }`;
        const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
        expect(cloneDeep(result.data!.concernDelete).deletedAt).not.toBeFalsy();
      });
    });
  });

  describe('concerns', () => {
    it('returns concerns', async () => {
      await transaction(Concern.knex(), async txn => {
        const { user } = await setup(txn);
        const concern1 = await Concern.create({ title: 'housing' }, txn);
        const concern2 = await Concern.create({ title: 'medical' }, txn);

        const query = `{
          concerns { title }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        const concernTitles = cloneDeep(result.data!.concerns).map((c: Concern) => c.title);
        expect(concernTitles).toContain(concern2.title);
        expect(concernTitles).toContain(concern1.title);
      });
    });

    it('returns concerns in a custom order', async () => {
      await transaction(Concern.knex(), async txn => {
        const { user } = await setup(txn);
        const concern1 = await Concern.create({ title: 'abc' }, txn);
        const concern2 = await Concern.create({ title: 'def' }, txn);

        const query = `{
          concerns(orderBy: titleAsc) { title }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions,
          txn,
        });
        expect(cloneDeep(result.data!.concerns)).toMatchObject([
          {
            title: concern1.title,
          },
          {
            title: concern2.title,
          },
        ]);
      });
    });
  });

  describe('concern add diagnosis code', () => {
    it('adds a diagnosis code to a concern', async () => {
      await transaction(Concern.knex(), async txn => {
        const { user } = await setup(txn);
        await DiagnosisCode.create(
          {
            codesetName: 'ICD-10',
            code: 'A00',
            label: 'Cholera',
            version: '2018',
          },
          txn,
        );
        const concern = await Concern.create({ title: 'Housing' }, txn);
        expect(concern.diagnosisCodes.length).toEqual(0);

        const mutation = `mutation {
          concernAddDiagnosisCode(input: {
            codesetName: "ICD-10",
            code: "A00",
            version: "2018",
            concernId: "${concern.id}"
          }) {
            title
            diagnosisCodes {
              codesetName
              code
              label
              version
            }
          }
        }`;
        const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result.data!.concernAddDiagnosisCode)).toMatchObject({
          title: concern.title,
          diagnosisCodes: [
            {
              codesetName: 'ICD-10',
              code: 'A00',
              label: 'Cholera',
              version: '2018',
            },
          ],
        });
      });
    });
  });

  describe('concern remove diagnosis code', () => {
    it('removes a diagnosis code from a concern', async () => {
      await transaction(Concern.knex(), async txn => {
        const { user } = await setup(txn);
        const diagnosisCode = await DiagnosisCode.create(
          {
            codesetName: 'ICD-10',
            code: 'A00',
            label: 'Cholera',
            version: '2018',
          },
          txn,
        );
        const concern = await Concern.create({ title: 'Housing' }, txn);
        await Concern.addDiagnosisCode(
          concern.id,
          {
            codesetName: 'ICD-10',
            code: 'A00',
            version: '2018',
          },
          txn,
        );
        const refetchedConcern = await Concern.get(concern.id, txn);
        expect(refetchedConcern.diagnosisCodes.length).toEqual(1);

        const mutation = `mutation {
          concernRemoveDiagnosisCode(input: {
            concernId: "${concern.id}"
            diagnosisCodeId: "${diagnosisCode.id}"
          }) {
            title
            diagnosisCodes {
              codesetName
              code
              label
              version
            }
          }
        }`;
        const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result.data!.concernRemoveDiagnosisCode)).toMatchObject({
          title: concern.title,
          diagnosisCodes: [],
        });
      });
    });
  });
});
