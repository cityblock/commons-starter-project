import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import RiskAreaGroup from '../../models/risk-area-group';
import User from '../../models/user';
import {
  createFullRiskAreaGroupAssociations,
  createMockClinic,
  createMockPatient,
  createMockRiskAreaGroup,
  createMockUser,
  createPatient,
} from '../../spec-helpers';

describe('risk area group model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a risk area group', async () => {
    const title = "Cersei's deception to Jon Snow";
    const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(title));

    expect(riskAreaGroup.title).toBe(title);
    expect(await RiskAreaGroup.get(riskAreaGroup.id)).toEqual(riskAreaGroup);
  });

  it('throws an error if risk area group does not exist for given id', async () => {
    const fakeId = uuid();
    await expect(RiskAreaGroup.get(fakeId)).rejects.toMatch(`No such risk area group: ${fakeId}`);
  });

  it('gets all risk area groups', async () => {
    const title = 'Family feud at Winterfell';
    const title2 = 'Viscerion is a zombie dragon';
    const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(title));
    const riskAreaGroup2 = await RiskAreaGroup.create(createMockRiskAreaGroup(title2));

    expect(await RiskAreaGroup.getAll()).toMatchObject([riskAreaGroup2, riskAreaGroup]);
  });

  it('edits risk area group', async () => {
    const title = 'Bran tells Jon about his heritage';
    const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(title));
    expect(riskAreaGroup.title).toBe(title);
    const title2 = "Jaime flees King's Landing";
    const editedRiskAreaGroup = await RiskAreaGroup.edit(
      {
        title: title2,
      },
      riskAreaGroup.id,
    );
    expect(editedRiskAreaGroup.title).toBe(title2);
  });

  it('throws error when trying to edit with bogus id', async () => {
    const fakeId = uuid();
    const title = 'Golden Company elephants';
    await expect(RiskAreaGroup.edit({ title }, fakeId)).rejects.toMatch(
      `No such risk area group: ${fakeId}`,
    );
  });

  it('deletes risk area group', async () => {
    const title = 'Nymeria not around to help';
    const title2 = 'The wall has been breached!';
    const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(title));
    const riskAreaGroup2 = await RiskAreaGroup.create(createMockRiskAreaGroup(title2));

    expect(riskAreaGroup.deletedAt).toBeFalsy();
    const deleted = await RiskAreaGroup.delete(riskAreaGroup.id);
    expect(deleted.deletedAt).toBeTruthy();

    expect(await RiskAreaGroup.getAll()).toMatchObject([riskAreaGroup2]);
  });

  it('throws error when trying to delete with bogus id', async () => {
    const fakeId = uuid();
    await expect(RiskAreaGroup.delete(fakeId)).rejects.toMatch(
      `No such risk area group: ${fakeId}`,
    );
  });

  it('gets the 360 summary for a given patient risk area group', async () => {
    await transaction(RiskAreaGroup.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id), txn);
      const patient = await createPatient(createMockPatient(11, clinic.id), user.id, txn);
      const title = 'Night King Breach of Wall';
      const riskAreaTitle = 'Zombie Viscerion';
      const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(title), txn);
      await createFullRiskAreaGroupAssociations(
        riskAreaGroup.id,
        patient.id,
        user.id,
        riskAreaTitle,
        txn,
      );

      const response = await RiskAreaGroup.getForPatient(riskAreaGroup.id, patient.id, txn);
      expect(response.riskAreas.length).toBe(2);
      expect(response.riskAreas[0].title).toBe(riskAreaTitle);
      expect(response.riskAreas[0].assessmentType).toBe('manual');
      expect(response.riskAreas[0].questions.length).toBe(3);
    });
  });
});
