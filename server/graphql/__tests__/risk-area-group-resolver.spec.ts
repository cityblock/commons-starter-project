import { subHours } from 'date-fns';
import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import uuid from 'uuid/v4';

import Clinic from '../../models/clinic';
import PatientGlassBreak from '../../models/patient-glass-break';
import RiskAreaGroup from '../../models/risk-area-group';
import User from '../../models/user';
import {
  createFullRiskAreaGroupAssociations,
  createMockClinic,
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

const userRole = 'admin' as UserRole;
const permissions = 'green';
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
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve risk area group', () => {
    it('gets all risk area groups', async () => {
      const { user, riskAreaGroup } = await setup(txn);
      const title2 = 'Cersei not on bandwagon';
      const riskAreaGroup2 = await RiskAreaGroup.create(createMockRiskAreaGroup(title2, 2), txn);
      const query = `{
          riskAreaGroups {
            id
            title
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      const riskAreaGroups = cloneDeep(result.data!.riskAreaGroups);
      const ids = riskAreaGroups.map((group: RiskAreaGroup) => group.id);
      const titles = riskAreaGroups.map((group: RiskAreaGroup) => group.title);

      expect(riskAreaGroups.length).toEqual(2);
      expect(ids).toContain(riskAreaGroup.id);
      expect(ids).toContain(riskAreaGroup2.id);
      expect(titles).toContain(riskAreaGroup.title);
      expect(titles).toContain(riskAreaGroup2.title);
    });

    it('fetches a single risk area group', async () => {
      const { riskAreaGroup, user } = await setup(txn);
      const query = `{
          riskAreaGroup(riskAreaGroupId: "${riskAreaGroup.id}") {
            id
            title
          }
        }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.riskAreaGroup)).toMatchObject({
        id: riskAreaGroup.id,
        title: mockTitle,
      });
    });

    it('throws an error if risk area group not found', async () => {
      const { user } = await setup(txn);
      const fakeId = uuid();
      const query = `{ riskAreaGroup(riskAreaGroupId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(result.errors![0].message).toMatch(`No such risk area group: ${fakeId}`);
    });

    it('fetches a risk area group for a patient', async () => {
      const { clinic, user } = await setup(txn);
      const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
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
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
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

    it('blocks fetching a risk area group for a patient with invalid glass break', async () => {
      const { clinic, user } = await setup(txn);
      const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
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
            patientId: "${patient.id}",
            glassBreakId: "${uuid()}"
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
      const result = await graphql(schema, query, null, {
        permissions: 'blue',
        userId: user.id,
        testTransaction: txn,
      });

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('blocks fetching a risk area group for a patient with too old glass break', async () => {
      const { clinic, user } = await setup(txn);
      const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
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
      const patientGlassBreak = await PatientGlassBreak.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason: 'Needed for routine care',
          note: null,
        },
        txn,
      );

      await PatientGlassBreak.query(txn)
        .where({ userId: user.id, patientId: patient.id })
        .patch({ createdAt: subHours(new Date(), 9).toISOString() });

      const query = `{
          riskAreaGroupForPatient(
            riskAreaGroupId: "${riskAreaGroup2.id}",
            patientId: "${patient.id}",
            glassBreakId: "${patientGlassBreak.id}"
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
      const result = await graphql(schema, query, null, {
        permissions: 'blue',
        userId: user.id,
        testTransaction: txn,
      });

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });
  });

  describe('risk area group create', () => {
    it('creates a new risk area group', async () => {
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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

  describe('risk area group edit', () => {
    it('edits a risk area group', async () => {
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
        permissions,
        userId: user.id,
        testTransaction: txn,
      });

      expect(cloneDeep(result.data!.riskAreaGroupEdit)).toMatchObject({
        title: newTitle,
        mediumRiskThreshold: newMediumRiskThreshold,
        highRiskThreshold,
      });
    });
  });

  describe('risk area group delete', () => {
    it('deletes a risk area group', async () => {
      const { riskAreaGroup, user } = await setup(txn);
      const mutation = `mutation {
          riskAreaGroupDelete(input: { riskAreaGroupId: "${riskAreaGroup.id}"}) {
            id,
          }
        }`;

      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });

      expect(cloneDeep(result.data!.riskAreaGroupDelete)).toMatchObject({
        id: riskAreaGroup.id,
      });
    });
  });
});
