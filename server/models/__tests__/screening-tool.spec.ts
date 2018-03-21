import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createRiskArea } from '../../spec-helpers';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';

interface ISetup {
  riskArea: RiskArea;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  return { riskArea };
}
describe('screening tool model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(ScreeningTool.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a screening tool', async () => {
    const { riskArea } = await setup(txn);
    const screeningTool = await ScreeningTool.create(
      {
        title: 'Screening Tool',
        riskAreaId: riskArea.id,
      },
      txn,
    );

    expect(screeningTool.title).toEqual('Screening Tool');
    expect(await ScreeningTool.get(screeningTool.id, txn)).toMatchObject(screeningTool);
  });

  it('throws an error if a screening tool does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(ScreeningTool.get(fakeId, txn)).rejects.toMatch(
      `No such screening tool: ${fakeId}`,
    );
  });

  it('edits a screening tool', async () => {
    const { riskArea } = await setup(txn);

    const screeningTool = await ScreeningTool.create(
      {
        title: 'Screening Tool',
        riskAreaId: riskArea.id,
      },
      txn,
    );

    const fetchedScreeningTool = await ScreeningTool.get(screeningTool.id, txn);
    expect(fetchedScreeningTool.title).toEqual('Screening Tool');

    await ScreeningTool.edit(screeningTool.id, { title: 'Edited Screening Tool Title' }, txn);
    const fetchedEditedScreeningTool = await ScreeningTool.get(screeningTool.id, txn);
    expect(fetchedEditedScreeningTool.title).toEqual('Edited Screening Tool Title');
  });

  it('gets all screening tools', async () => {
    const { riskArea } = await setup(txn);

    const riskArea2 = await createRiskArea({ title: 'Food', order: 2 }, txn);
    const screeningTool1 = await ScreeningTool.create(
      {
        title: 'Screening Tool 1',
        riskAreaId: riskArea.id,
      },
      txn,
    );
    const screeningTool2 = await ScreeningTool.create(
      {
        title: 'Screening Tool 2',
        riskAreaId: riskArea.id,
      },
      txn,
    );
    const screeningTool3 = await ScreeningTool.create(
      {
        title: 'Screening Tool 3',
        riskAreaId: riskArea2.id,
      },
      txn,
    );

    const screeningTools = await ScreeningTool.getAll(txn);
    expect(screeningTools.length).toEqual(3);
    const screeningToolIds = screeningTools.map(tool => tool.id);
    expect(screeningToolIds).toContain(screeningTool1.id);
    expect(screeningToolIds).toContain(screeningTool2.id);
    expect(screeningToolIds).toContain(screeningTool3.id);
  });

  it('deletes a screening tool', async () => {
    const { riskArea } = await setup(txn);

    const screeningTool = await ScreeningTool.create(
      {
        title: 'Screening Tool',
        riskAreaId: riskArea.id,
      },
      txn,
    );

    const fetchedScreeningTool = await ScreeningTool.get(screeningTool.id, txn);
    expect(fetchedScreeningTool.deletedAt).toBeFalsy();

    await ScreeningTool.delete(screeningTool.id, txn);

    await expect(ScreeningTool.get(screeningTool.id, txn)).rejects.toMatch(
      `No such screening tool: ${screeningTool.id}`,
    );
  });
});
