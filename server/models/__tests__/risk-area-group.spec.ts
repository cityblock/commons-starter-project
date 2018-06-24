import { transaction } from 'objection';
import uuid from 'uuid/v4';
import {
  createFullRiskAreaGroupAssociations,
  createMockClinic,
  createMockRiskAreaGroup,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import RiskAreaGroup from '../risk-area-group';
import User from '../user';

describe('risk area group model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(RiskAreaGroup.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('creates and gets a risk area group', async () => {
    const title = "Cersei's deception to Jon Snow";
    const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(title), txn);

    expect(riskAreaGroup.title).toBe(title);
    expect(await RiskAreaGroup.get(riskAreaGroup.id, txn)).toEqual(riskAreaGroup);
  });

  it('throws an error if risk area group does not exist for given id', async () => {
    const fakeId = uuid();
    await expect(RiskAreaGroup.get(fakeId, txn)).rejects.toMatch(
      `No such risk area group: ${fakeId}`,
    );
  });

  it('gets all risk area groups', async () => {
    const title = 'Family feud at Winterfell';
    const title2 = 'Viscerion is a zombie dragon';
    const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(title, 2), txn);
    const riskAreaGroup2 = await RiskAreaGroup.create(createMockRiskAreaGroup(title2), txn);
    const riskAreaGroup3 = await RiskAreaGroup.create(createMockRiskAreaGroup(title), txn);

    expect(await RiskAreaGroup.getAll(txn)).toMatchObject([
      riskAreaGroup3,
      riskAreaGroup2,
      riskAreaGroup,
    ]);
  });

  it('edits risk area group', async () => {
    const title = 'Bran tells Jon about his heritage';
    const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(title), txn);
    expect(riskAreaGroup.title).toBe(title);
    const title2 = "Jaime flees King's Landing";
    const editedRiskAreaGroup = await RiskAreaGroup.edit(
      {
        title: title2,
      },
      riskAreaGroup.id,
      txn,
    );
    expect(editedRiskAreaGroup.title).toBe(title2);
  });

  it('throws error when trying to edit with bogus id', async () => {
    const fakeId = uuid();
    const title = 'Golden Company elephants';
    await expect(RiskAreaGroup.edit({ title }, fakeId, txn)).rejects.toMatch(
      `No such risk area group: ${fakeId}`,
    );
  });

  it('deletes risk area group', async () => {
    const title = 'Nymeria not around to help';
    const title2 = 'The wall has been breached!';
    const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(title), txn);
    const riskAreaGroup2 = await RiskAreaGroup.create(createMockRiskAreaGroup(title2), txn);

    expect(riskAreaGroup.deletedAt).toBeFalsy();
    const deleted = await RiskAreaGroup.delete(riskAreaGroup.id, txn);
    expect(deleted.deletedAt).toBeTruthy();

    expect(await RiskAreaGroup.getAll(txn)).toMatchObject([riskAreaGroup2]);
  });

  it('throws error when trying to delete with bogus id', async () => {
    const fakeId = uuid();
    await expect(RiskAreaGroup.delete(fakeId, txn)).rejects.toMatch(
      `No such risk area group: ${fakeId}`,
    );
  });

  it('gets the 360 summary for a given patient risk area group', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id), txn);
    const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
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

    expect(response.riskAreas).toContainEqual(
      expect.objectContaining({
        title: riskAreaTitle,
        assessmentType: 'manual',
      }),
    );

    expect(response.riskAreas[0].questions.length).toBe(3);
    expect(response.riskAreas[0].riskAreaAssessmentSubmissions.length).toBe(1);
    expect(response.riskAreas[0].riskAreaAssessmentSubmissions[0].patientId).toBe(patient.id);
    expect(response.riskAreas[0].screeningTools.length).toBe(1);
    expect(response.riskAreas[0].screeningTools[0].patientScreeningToolSubmissions.length).toBe(1);

    const submission = response.riskAreas[0].screeningTools[0].patientScreeningToolSubmissions[0];

    // TODO: Dig into createFullRiskAreaGroupAssociations to see why this should be 1
    expect(submission.patientAnswers.length).toBe(1);
  });
});
