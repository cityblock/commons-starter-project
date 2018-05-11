import { transaction, Transaction } from 'objection';

import Concern from '../concern';
import ConcernDiagnosisCode from '../concern-diagnosis-code';
import DiagnosisCode from '../diagnosis-code';

interface ISetup {
  concern: Concern;
  diagnosisCode: DiagnosisCode;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const concern = await Concern.create({ title: 'Housing' }, txn);
  const diagnosisCode = await DiagnosisCode.create(
    {
      codesetName: 'ICD10',
      code: 'A00.0',
      label: 'Cholera due to Vibrio cholerae 01, biovar eltor',
      version: '2018',
    },
    txn,
  );

  return { concern, diagnosisCode };
}

describe('concern diagnosis code model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(ConcernDiagnosisCode.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('creating a concern diagnosis code', () => {
    it('creates a concern diagnosis code and associations', async () => {
      const { concern, diagnosisCode } = await setup(txn);

      expect(concern.diagnosisCodes.length).toEqual(0);

      await ConcernDiagnosisCode.create(
        {
          concernId: concern.id,
          diagnosisCodeId: diagnosisCode.id,
        },
        txn,
      );

      const fetchedConcern = await Concern.get(concern.id, txn);

      expect(fetchedConcern.diagnosisCodes.length).toEqual(1);
      expect(fetchedConcern.diagnosisCodes[0]).toMatchObject(diagnosisCode);
    });

    it('is a noop when creating a duplicate concern diagnosis code', async () => {
      const { concern, diagnosisCode } = await setup(txn);

      await ConcernDiagnosisCode.create(
        {
          concernId: concern.id,
          diagnosisCodeId: diagnosisCode.id,
        },
        txn,
      );
      await ConcernDiagnosisCode.create(
        {
          concernId: concern.id,
          diagnosisCodeId: diagnosisCode.id,
        },
        txn,
      );

      const fetchedConcern = await Concern.get(concern.id, txn);
      expect(fetchedConcern.diagnosisCodes.length).toEqual(1);
    });

    it('is creates a duplicate when the existing one is already deleted', async () => {
      const { concern, diagnosisCode } = await setup(txn);

      await ConcernDiagnosisCode.create(
        {
          concernId: concern.id,
          diagnosisCodeId: diagnosisCode.id,
        },
        txn,
      );

      const fetchedConcern = await Concern.get(concern.id, txn);
      expect(fetchedConcern.diagnosisCodes.length).toEqual(1);

      await ConcernDiagnosisCode.delete(concern.id, diagnosisCode.id, txn);

      const refetchedConcern = await Concern.get(concern.id, txn);
      expect(refetchedConcern.diagnosisCodes.length).toEqual(0);

      await ConcernDiagnosisCode.create(
        {
          concernId: concern.id,
          diagnosisCodeId: diagnosisCode.id,
        },
        txn,
      );

      const finalRefetchedConcern = await Concern.get(concern.id, txn);
      expect(finalRefetchedConcern.diagnosisCodes.length).toEqual(1);
    });
  });

  it('deletes a concern diagnosis code and updates associations', async () => {
    const { concern, diagnosisCode } = await setup(txn);

    await ConcernDiagnosisCode.create(
      {
        concernId: concern.id,
        diagnosisCodeId: diagnosisCode.id,
      },
      txn,
    );

    const fetchedConcern = await Concern.get(concern.id, txn);
    expect(fetchedConcern.diagnosisCodes.length).toEqual(1);

    await ConcernDiagnosisCode.delete(concern.id, fetchedConcern.diagnosisCodes[0].id, txn);

    const refetchedConcern = await Concern.get(concern.id, txn);
    expect(refetchedConcern.diagnosisCodes.length).toEqual(0);
  });
});
