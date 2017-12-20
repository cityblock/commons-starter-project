import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createRiskArea } from '../../spec-helpers';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';

describe('screening tool model', () => {
  let riskArea: RiskArea;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    riskArea = await createRiskArea({ title: 'Housing' });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a screening tool', async () => {
    const screeningTool = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    });

    expect(screeningTool.title).toEqual('Screening Tool');
    expect(await ScreeningTool.get(screeningTool.id)).toMatchObject(screeningTool);
  });

  it('throws an error if a screening tool does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(ScreeningTool.get(fakeId)).rejects.toMatch(`No such screening tool: ${fakeId}`);
  });

  it('edits a screening tool', async () => {
    const screeningTool = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    });

    const fetchedScreeningTool = await ScreeningTool.get(screeningTool.id);
    expect(fetchedScreeningTool.title).toEqual('Screening Tool');

    await ScreeningTool.edit(screeningTool.id, { title: 'Edited Screening Tool Title' });
    const fetchedEditedScreeningTool = await ScreeningTool.get(screeningTool.id);
    expect(fetchedEditedScreeningTool.title).toEqual('Edited Screening Tool Title');
  });

  it('gets all screening tools for a risk area', async () => {
    const riskArea2 = await createRiskArea({ title: 'Food', order: 2 });
    const screeningTool1 = await ScreeningTool.create({
      title: 'Screening Tool 1',
      riskAreaId: riskArea.id,
    });
    const screeningTool2 = await ScreeningTool.create({
      title: 'Screening Tool 2',
      riskAreaId: riskArea.id,
    });
    const screeningTool3 = await ScreeningTool.create({
      title: 'Screening Tool 3',
      riskAreaId: riskArea2.id,
    });

    const screeningTools = await ScreeningTool.getForRiskArea(riskArea.id);
    const screeningToolIds = screeningTools.map(tool => tool.id);
    expect(screeningTools.length).toEqual(2);
    expect(screeningTools).toMatchObject([screeningTool1, screeningTool2]);
    expect(screeningToolIds).not.toContain(screeningTool3.id);
  });

  it('gets all screening tools', async () => {
    const riskArea2 = await createRiskArea({ title: 'Food', order: 2 });
    const screeningTool1 = await ScreeningTool.create({
      title: 'Screening Tool 1',
      riskAreaId: riskArea.id,
    });
    const screeningTool2 = await ScreeningTool.create({
      title: 'Screening Tool 2',
      riskAreaId: riskArea.id,
    });
    const screeningTool3 = await ScreeningTool.create({
      title: 'Screening Tool 3',
      riskAreaId: riskArea2.id,
    });

    const screeningTools = await ScreeningTool.getAll();
    expect(screeningTools.length).toEqual(3);
    expect(screeningTools).toMatchObject([screeningTool1, screeningTool2, screeningTool3]);
  });

  it('deletes a screening tool', async () => {
    const screeningTool = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    });

    const fetchedScreeningTool = await ScreeningTool.get(screeningTool.id);
    expect(fetchedScreeningTool.deletedAt).toBeFalsy();

    await ScreeningTool.delete(screeningTool.id);

    await expect(ScreeningTool.get(screeningTool.id)).rejects.toMatch(
      `No such screening tool: ${screeningTool.id}`,
    );
  });
});
