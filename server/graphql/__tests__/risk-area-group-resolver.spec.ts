import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
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
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
  riskAreaGroup: RiskAreaGroup;
  clinic: Clinic;
}

const userRole = 'admin';
const title = 'Night King Breached the Wall!';
const shortTitle = 'FML';
const mockTitle = "Littlefinger's treachery";
const mediumRiskThreshold = 50;
const highRiskThreshold = 80;
const order = 11;

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(mockTitle), txn);

  return { user, riskAreaGroup, clinic };
}

describe('risk area group resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve risk area group', () => {
    it('gets all risk area groups', async () => {
      await transaction(RiskAreaGroup.knex(), async txn => {
        const { user, riskAreaGroup } = await setup(txn);
        const title2 = 'Cersei not on bandwagon';
        const riskAreaGroup2 = await RiskAreaGroup.create(createMockRiskAreaGroup(title2, 2), txn);
        const query = `{
          riskAreaGroups {
            id
            title
          }
        }`;

        const result = await graphql(schema, query, null, { db, userRole, userId: user.id, txn });
        const riskAreaGroups = cloneDeep(result.data!.riskAreaGroups);
        const ids = riskAreaGroups.map((group: RiskAreaGroup) => group.id);
        const titles = riskAreaGroups.map((group: RiskAreaGroup) => group.title);

        expect(riskAreaGroups.length).toEqual(2);
        expect(ids).toContain(riskAreaGroup.id);
        expect(ids).toContain(riskAreaGroup2.id);
        expect(titles).toContain(riskAreaGroup.title);
        expect(titles).toContain(riskAreaGroup2.title);
      });
    });

    it('fetches a single risk area group', async () => {
      await transaction(RiskAreaGroup.knex(), async txn => {
        const { riskAreaGroup } = await setup(txn);
        const query = `{
          riskAreaGroup(riskAreaGroupId: "${riskAreaGroup.id}") {
            id
            title
          }
        }`;
        const result = await graphql(schema, query, null, { db, userRole, txn });
        expect(cloneDeep(result.data!.riskAreaGroup)).toMatchObject({
          id: riskAreaGroup.id,
          title: mockTitle,
        });
      });
    });

    it('throws an error if risk area group not found', async () => {
      await transaction(RiskAreaGroup.knex(), async txn => {
        const fakeId = uuid();
        const query = `{ riskAreaGroup(riskAreaGroupId: "${fakeId}") { id } }`;
        const result = await graphql(schema, query, null, { db, userRole, txn });
        expect(result.errors![0].message).toMatch(`No such risk area group: ${fakeId}`);
      });
    });

    it('fetches a risk area group for a patient', async () => {
      await transaction(RiskAreaGroup.knex(), async txn => {
        const { clinic, user } = await setup(txn);
        const patient = await createPatient(createMockPatient(11, clinic.id), user.id, txn);
        const title2 = 'Night King Breach of Wall';
        const riskAreaTitle = 'Zombie Viscerion';
        const riskAreaGroup2 = await RiskAreaGroup.create(createMockRiskAreaGroup(title2), txn);
        await createFullRiskAreaGroupAssociations(
          riskAreaGroup2.id,
          patient.id,
          user.id,
          riskAreaTitle,
          txn,
        );
        const query = `{
          riskAreaGroupForPatient(
            riskAreaGroupId: "${riskAreaGroup2.id}",
            patientId: "${patient.id}"
          ) {
            id
            title
            riskAreas {
              title
              questions {
                answers {
                  patientAnswers {
                    patientId
                  }
                }
              }
            }
          }
        }`;
        const result = await graphql(schema, query, null, { userRole, userId: user.id, txn });
        const clonedResult = cloneDeep(result.data!.riskAreaGroupForPatient);

        expect(clonedResult).toMatchObject({
          id: riskAreaGroup2.id,
          title: riskAreaGroup2.title,
        });
        expect(clonedResult.riskAreas.length).toBe(2);
        expect(clonedResult.riskAreas[0].title).toBe(riskAreaTitle);
        expect(clonedResult.riskAreas[0].questions.length).toBe(3);
        expect(clonedResult.riskAreas[0].questions[0].answers.length).toBe(1);
        expect(clonedResult.riskAreas[0].questions[0].answers[0].patientAnswers.length).toBe(1);
      });
    });
  });

  describe('risk area group create', () => {
    it('creates a new risk area group', async () => {
      await transaction(RiskAreaGroup.knex(), async txn => {
        const { user } = await setup(txn);
        const mutation = `mutation {
          riskAreaGroupCreate(input: {
            title: "${title}",
            shortTitle: "${shortTitle}"
            mediumRiskThreshold: ${mediumRiskThreshold},
            highRiskThreshold: ${highRiskThreshold},
            order: ${order},
          }) {
            title
            shortTitle
            mediumRiskThreshold
            highRiskThreshold
            order
          }
        }`;

        const result = await graphql(schema, mutation, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.riskAreaGroupCreate)).toMatchObject({
          title,
          shortTitle,
          mediumRiskThreshold,
          highRiskThreshold,
          order,
        });
      });
    });
  });

  describe('risk area group edit', () => {
    it('edits a risk area group', async () => {
      await transaction(RiskAreaGroup.knex(), async txn => {
        const { riskAreaGroup, user } = await setup(txn);
        const newTitle = 'Sansa pwns Littlefinger';
        const newMediumRiskThreshold = 10;
        const mutation = `mutation {
          riskAreaGroupEdit(input: {
            title: "${newTitle}",
            mediumRiskThreshold: ${newMediumRiskThreshold},
            riskAreaGroupId: "${riskAreaGroup.id}"
          }) {
            title
            mediumRiskThreshold
            highRiskThreshold
          }
        }`;

        const result = await graphql(schema, mutation, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.riskAreaGroupEdit)).toMatchObject({
          title: newTitle,
          mediumRiskThreshold: newMediumRiskThreshold,
          highRiskThreshold,
        });
      });
    });
  });

  describe('risk area group delete', () => {
    it('deletes a risk area group', async () => {
      await transaction(RiskAreaGroup.knex(), async txn => {
        const { riskAreaGroup, user } = await setup(txn);
        const mutation = `mutation {
          riskAreaGroupDelete(input: { riskAreaGroupId: "${riskAreaGroup.id}"}) {
            id,
          }
        }`;

        const result = await graphql(schema, mutation, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.riskAreaGroupDelete)).toMatchObject({
          id: riskAreaGroup.id,
        });
      });
    });
  });
});
