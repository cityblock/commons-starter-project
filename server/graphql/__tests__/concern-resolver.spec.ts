import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as concernAddDiagnosisCode from '../../../app/graphql/queries/concern-add-diagnosis-code-mutation.graphql';
import * as concernCreate from '../../../app/graphql/queries/concern-create-mutation.graphql';
import * as concernDelete from '../../../app/graphql/queries/concern-delete-mutation.graphql';
import * as concernEdit from '../../../app/graphql/queries/concern-edit-mutation.graphql';
import * as concernRemoveDiagnosisCode from '../../../app/graphql/queries/concern-remove-diagnosis-code-mutation.graphql';
import * as getConcern from '../../../app/graphql/queries/get-concern.graphql';
import * as getConcerns from '../../../app/graphql/queries/get-concerns.graphql';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import DiagnosisCode from '../../models/diagnosis-code';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin' as UserRole;
const permissions = 'green';

interface ISetup {
  user: User;
}

async function setup(trx: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole), trx);
  return { user };
}

describe('concern resolver', () => {
  let txn = null as any;
  let db: Db;
  const concernCreateMutation = print(concernCreate);
  const concernDeleteMutation = print(concernDelete);
  const concernEditMutation = print(concernEdit);
  const getConcernQuery = print(getConcern);
  const getConcernsQuery = print(getConcerns);
  const concernAddDiagnosisCodeMutation = print(concernAddDiagnosisCode);
  const concernRemoveDiagnosisCodeMutation = print(concernRemoveDiagnosisCode);

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

  describe('resolve concern', () => {
    it('fetches a concern', async () => {
      const { user } = await setup(txn);
      const concern = await Concern.create({ title: 'Housing' }, txn);
      const result = await graphql(
        schema,
        getConcernQuery,
        null,
        { permissions, userId: user.id, txn },
        {
          concernId: concern.id,
        },
      );
      expect(cloneDeep(result.data!.concern)).toMatchObject({
        title: 'Housing',
      });
    });
  });

  describe('concern create', () => {
    it('creates a concern', async () => {
      const { user } = await setup(txn);
      const result = await graphql(
        schema,
        concernCreateMutation,
        null,
        { permissions, userId: user.id, txn },
        { title: 'Housing' },
      );
      expect(cloneDeep(result.data!.concernCreate)).toMatchObject({
        title: 'Housing',
      });
    });
  });

  describe('concern edit', () => {
    it('edits a concern', async () => {
      const { user } = await setup(txn);
      const concern = await Concern.create({ title: 'housing' }, txn);
      const result = await graphql(
        schema,
        concernEditMutation,
        null,
        { permissions, userId: user.id, txn },
        {
          title: 'Medical',
          concernId: concern.id,
        },
      );
      expect(cloneDeep(result.data!.concernEdit)).toMatchObject({
        title: 'Medical',
      });
    });
  });

  describe('concern delete', () => {
    it('deletes a concern', async () => {
      const { user } = await setup(txn);
      const concern = await Concern.create({ title: 'housing' }, txn);
      const result = await graphql(
        schema,
        concernDeleteMutation,
        null,
        { permissions, userId: user.id, txn },
        {
          concernId: concern.id,
        },
      );
      expect(cloneDeep(result.data!.concernDelete).deletedAt).not.toBeFalsy();
    });
  });

  describe('concerns', () => {
    it('returns concerns', async () => {
      const { user } = await setup(txn);
      const concern1 = await Concern.create({ title: 'housing' }, txn);
      const concern2 = await Concern.create({ title: 'medical' }, txn);

      const result = await graphql(schema, getConcernsQuery, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const concernTitles = cloneDeep(result.data!.concerns).map((c: Concern) => c.title);
      expect(concernTitles).toContain(concern2.title);
      expect(concernTitles).toContain(concern1.title);
    });

    it('returns concerns in a custom order', async () => {
      const { user } = await setup(txn);
      const concern1 = await Concern.create({ title: 'abc' }, txn);
      const concern2 = await Concern.create({ title: 'def' }, txn);

      const result = await graphql(
        schema,
        getConcernsQuery,
        null,
        {
          db,
          userId: user.id,
          permissions,
          txn,
        },
        {
          orderBy: 'titleAsc',
        },
      );
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

  describe('concern add diagnosis code', () => {
    it('adds a diagnosis code to a concern', async () => {
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

      const result = await graphql(
        schema,
        concernAddDiagnosisCodeMutation,
        null,
        { userId: user.id, permissions, txn },
        {
          codesetName: 'ICD-10',
          code: 'A00',
          version: '2018',
          concernId: concern.id,
        },
      );
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

  describe('concern remove diagnosis code', () => {
    it('removes a diagnosis code from a concern', async () => {
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

      const result = await graphql(
        schema,
        concernRemoveDiagnosisCodeMutation,
        null,
        { userId: user.id, permissions, txn },
        {
          concernId: concern.id,
          diagnosisCodeId: diagnosisCode.id,
        },
      );
      expect(cloneDeep(result.data!.concernRemoveDiagnosisCode)).toMatchObject({
        title: concern.title,
        diagnosisCodes: [],
      });
    });
  });
});
