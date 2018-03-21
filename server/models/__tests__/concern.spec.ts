import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Concern from '../concern';
import DiagnosisCode from '../diagnosis-code';

const order = 'asc';
const orderBy = 'createdAt';

describe('concern model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(Concern.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('concern methods', () => {
    it('creates and retrieves a concern', async () => {
      const concern = await Concern.create({ title: 'Housing' }, txn);
      const concernById = await Concern.get(concern.id, txn);

      expect(concernById).toMatchObject(concern);
    });

    it('throws an error when getting a concern by an invalid id', async () => {
      const fakeId = uuid();
      await expect(Concern.get(fakeId, txn)).rejects.toMatch(`No such concern: ${fakeId}`);
    });

    it('edits concern', async () => {
      const concern = await Concern.create(
        {
          title: 'Housing',
        },
        txn,
      );
      const concernUpdated = await Concern.edit(
        concern.id,
        {
          title: 'Medical',
        },
        txn,
      );
      expect(concernUpdated.title).toEqual('Medical');
    });

    it('deleted concern', async () => {
      const concern = await Concern.create(
        {
          title: 'Housing',
        },
        txn,
      );
      expect(concern.deletedAt).toBeFalsy();
      const deleted = await Concern.delete(concern.id, txn);
      expect(deleted.deletedAt).not.toBeFalsy();
    });

    it('fetches all concerns', async () => {
      const concern1 = await Concern.create({ title: 'Housing' }, txn);
      const concern2 = await Concern.create({ title: 'Medical' }, txn);

      expect(await Concern.getAll({ orderBy, order }, txn)).toMatchObject([concern1, concern2]);
    });

    it('fetches all concerns in a custom order', async () => {
      const concern1 = await Concern.create({ title: 'def' }, txn);
      const concern2 = await Concern.create({ title: 'abc' }, txn);

      expect(await Concern.getAll({ orderBy: 'title', order: 'asc' }, txn)).toMatchObject([
        concern2,
        concern1,
      ]);
    });

    it('finds or creates a concern by title', async () => {
      const concern = await Concern.create({ title: 'housing' }, txn);
      const foundOrCreatedConcern = await Concern.findOrCreateByTitle('Housing', txn);
      const fetchedConcerns = await Concern.getAll({ orderBy, order }, txn);

      expect(fetchedConcerns.length).toEqual(1);
      expect(foundOrCreatedConcern).toMatchObject(concern);
    });

    describe('adding a diagnosis code', () => {
      it('adds a diagnosis code', async () => {
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
        const fetchedConcern = await Concern.get(concern.id, txn);

        expect(fetchedConcern.diagnosisCodes.length).toEqual(0);

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
        expect(refetchedConcern.diagnosisCodes).toMatchObject([diagnosisCode]);
      });

      it('adds a dignosis code when the code has random dots/spaces in it', async () => {
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
            code: ' .A 0.0 ',
            version: '2018',
          },
          txn,
        );
        const fetchedConcern = await Concern.get(concern.id, txn);

        expect(fetchedConcern.diagnosisCodes.length).toEqual(1);
        expect(fetchedConcern.diagnosisCodes).toMatchObject([diagnosisCode]);
      });

      it('adds a diagnosis code when the capitalization is off', async () => {
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
            code: ' .a 0.0 ',
            version: '2018',
          },
          txn,
        );
        const fetchedConcern = await Concern.get(concern.id, txn);

        expect(fetchedConcern.diagnosisCodes.length).toEqual(1);
        expect(fetchedConcern.diagnosisCodes).toMatchObject([diagnosisCode]);
      });

      it('throws an error when adding an invalid diagnosis code', async () => {
        const codesetName = 'ICD-10';
        const code = 'MadeUpCode';
        const version = '2018';
        const concern = await Concern.create({ title: 'Housing' }, txn);

        await expect(
          Concern.addDiagnosisCode(concern.id, { codesetName, code, version }, txn),
        ).rejects.toMatch(
          `Cannot find diagnosis code for codeset: ${codesetName} and code: ${code}`,
        );
      });
    });

    describe('removing a diagnosis code', () => {
      it('removes a diagnosis code', async () => {
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

        const fetchedConcern = await Concern.get(concern.id, txn);
        expect(fetchedConcern.diagnosisCodes.length).toEqual(1);

        await Concern.removeDiagnosisCode(concern.id, diagnosisCode.id, txn);

        const refetchedConcern = await Concern.get(concern.id, txn);
        expect(refetchedConcern.diagnosisCodes.length).toEqual(0);

        // Then, just to be safe, we make sure we can re-add a deleted one
        await Concern.addDiagnosisCode(
          concern.id,
          {
            codesetName: 'ICD-10',
            code: 'A00',
            version: '2018',
          },
          txn,
        );

        const againRefetchedConcern = await Concern.get(concern.id, txn);
        expect(againRefetchedConcern.diagnosisCodes.length).toEqual(1);
      });

      it('is a noop when removing a non-existent diagnosis code', async () => {
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
        await Concern.addDiagnosisCode(
          concern.id,
          {
            codesetName: 'ICD-10',
            code: 'A00',
            version: '2018',
          },
          txn,
        );

        await Concern.removeDiagnosisCode(concern.id, uuid(), txn);

        const refetchedConcern = await Concern.get(concern.id, txn);
        expect(refetchedConcern.diagnosisCodes.length).toEqual(1);
      });
    });
  });
});
