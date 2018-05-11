import { transaction } from 'objection';
import * as uuid from 'uuid/v4';

import DiagnosisCode from '../diagnosis-code';

const orderBy = 'label';
const order = 'asc';

describe('diagnosis code model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(DiagnosisCode.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('diagnosis code', () => {
    it('creates and gets a diagnosis code', async () => {
      const diagnosisCode = await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: 'A00',
          label: 'Cholera',
          version: '2018',
        },
        txn,
      );
      const fetchedDiagnosisCode = await DiagnosisCode.get(diagnosisCode.id, txn);

      expect(fetchedDiagnosisCode).toMatchObject(diagnosisCode);
    });

    it('strips irrelevant dots and spaces from code when creating', async () => {
      const diagnosisCode = await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: ' .A0.0',
          label: 'Cholera',
          version: '2018',
        },
        txn,
      );
      const fetchedDiagnosisCode = await DiagnosisCode.get(diagnosisCode.id, txn);

      expect(fetchedDiagnosisCode.code).toEqual('A00');
    });

    it('is a noop when creating a code that already exists', async () => {
      const diagnosisCode = await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: 'A00',
          label: 'Cholera',
          version: '2018',
        },
        txn,
      );
      const doubleCreatedDiagnosisCode = await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: ' .A00.',
          label: 'Cholera',
          version: '2018',
        },
        txn,
      );

      expect(doubleCreatedDiagnosisCode).toMatchObject(diagnosisCode);

      const newDiagnosisCode = await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: 'A000',
          label: 'Cholera due to Bivrio cholerae 01, biovar cholerae',
          version: '2018',
        },
        txn,
      );

      expect(newDiagnosisCode.id).not.toEqual(diagnosisCode.id);
    });

    it('throws an error when getting a diagnosis code by an invalid id', async () => {
      const fakeId = uuid();
      await expect(DiagnosisCode.get(fakeId, txn)).rejects.toMatch(
        `No such diagnosis code: ${fakeId}`,
      );
    });

    it('gets all diagnosis codes', async () => {
      const diagnosisCodes = await DiagnosisCode.getAll({ orderBy, order }, txn);

      expect(diagnosisCodes.length).toEqual(0);

      const diagnosisCode1 = await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: 'A00',
          label: 'Cholera',
          version: '2018',
        },
        txn,
      );
      const diagnosisCode2 = await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: 'A010',
          label: 'Typhoid fever',
          version: '2018',
        },
        txn,
      );
      const refetchedDiagnosisCodes = await DiagnosisCode.getAll({ orderBy, order }, txn);

      expect(refetchedDiagnosisCodes.length).toEqual(2);
      expect(refetchedDiagnosisCodes).toMatchObject([diagnosisCode1, diagnosisCode2]);
    });

    describe('getting a diagnosis code by codeset name and code and version', () => {
      it('returns the found diagnosis code', async () => {
        const diagnosisCode = await DiagnosisCode.create(
          {
            codesetName: 'ICD-10',
            code: 'A00',
            label: 'Cholera',
            version: '2018',
          },
          txn,
        );
        const fetchedDiagnosisCode = await DiagnosisCode.getByCodesetNameAndCodeAndVersion(
          'ICD-10',
          'A00',
          '2018',
          txn,
        );

        expect(fetchedDiagnosisCode).toMatchObject(diagnosisCode);
      });

      it('returns null if no diagnosis code can be found', async () => {
        const fetchedDiagnosisCode = await DiagnosisCode.getByCodesetNameAndCodeAndVersion(
          'ICD-10',
          'MadeUpCode',
          '2018',
          txn,
        );

        expect(fetchedDiagnosisCode).toBeNull();
      });

      it('ignores spaces and dots when finding a diagnosis code', async () => {
        const diagnosisCode = await DiagnosisCode.create(
          {
            codesetName: 'ICD-10',
            code: 'A000',
            label: 'Cholera',
            version: '2018',
          },
          txn,
        );
        const fetchedDiagnosisCode = await DiagnosisCode.getByCodesetNameAndCodeAndVersion(
          'ICD-10',
          ' .A00.   0 ',
          '2018',
          txn,
        );

        expect(fetchedDiagnosisCode).toMatchObject(diagnosisCode);
      });
    });

    it('deletes a diagnosis code', async () => {
      const diagnosisCode = await DiagnosisCode.create(
        {
          codesetName: 'ICD-10',
          code: 'A00',
          label: 'Cholera',
          version: '2018',
        },
        txn,
      );
      expect(diagnosisCode.deletedAt).toBeNull();

      const deletedDiagnosisCode = await DiagnosisCode.delete(diagnosisCode.id, txn);
      expect(deletedDiagnosisCode.deletedAt).not.toBeUndefined();
      expect(deletedDiagnosisCode.deletedAt).not.toBeNull();

      await expect(DiagnosisCode.get(diagnosisCode.id, txn)).rejects.toMatch(
        `No such diagnosis code: ${diagnosisCode.id}`,
      );
    });
  });
});
