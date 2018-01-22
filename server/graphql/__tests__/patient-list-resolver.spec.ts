import { graphql } from 'graphql';
import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import PatientList from '../../models/patient-list';
import User from '../../models/user';
import { createAnswerAssociations, createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';
const title = 'The Faith Militant';
const order = 11;

describe('patient list resolver', () => {
  let clinic: Clinic;
  let user: User;
  let answer1: Answer;
  let answer2: Answer;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    await transaction(PatientList.knex(), async txn => {
      clinic = await Clinic.create(createMockClinic(), txn);
      user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const answers = await createAnswerAssociations(txn);
      answer1 = answers.answer1;
      answer2 = answers.answer2;
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient list', () => {
    it('gets all patient lists', async () => {
      await transaction(PatientList.knex(), async txn => {
        const title1 = 'Red priests';
        const title2 = 'The Knights of the Vale';

        const patientList1 = await PatientList.create(
          {
            title: title1,
            answerId: answer1.id,
            order: 1,
          },
          txn,
        );
        const patientList2 = await PatientList.create(
          {
            title: title2,
            answerId: answer2.id,
            order: 2,
          },
          txn,
        );

        const query = `{
          patientLists {
            id
            title
            answerId
          }
        }`;

        const result = await graphql(schema, query, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientLists[0]).toMatchObject({
          id: patientList1.id,
          title: title1,
          answerId: answer1.id,
        });
        expect(result.data!.patientLists[1]).toMatchObject({
          id: patientList2.id,
          title: title2,
          answerId: answer2.id,
        });
      });
    });

    it('fetches a single patient list', async () => {
      await transaction(PatientList.knex(), async txn => {
        const patientList = await PatientList.create(
          {
            title,
            answerId: answer1.id,
            order,
          },
          txn,
        );

        const query = `{
          patientList(patientListId: "${patientList.id}") {
            id
            title
            answerId
            order
          }
        }`;

        const result = await graphql(schema, query, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientList).toMatchObject({
          id: patientList.id,
          title,
          answerId: answer1.id,
          order,
        });
      });
    });

    it('throws an error if patient list not found', async () => {
      await transaction(PatientList.knex(), async txn => {
        const fakeId = uuid();
        const query = `{ patientList(patientListId: "${fakeId}") { id } }`;

        const result = await graphql(schema, query, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.errors![0].message).toMatch(`No such patient list: ${fakeId}`);
      });
    });
  });

  describe('patient list create', () => {
    it('creates a new patient list', async () => {
      await transaction(PatientList.knex(), async txn => {
        const mutation = `mutation {
          patientListCreate(input: {
            title: "${title}",
            answerId: "${answer1.id}"
            order: ${order}
          }) {
            title
            answerId
            order
          }
        }`;

        const result = await graphql(schema, mutation, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientListCreate).toMatchObject({
          title,
          answerId: answer1.id,
          order,
        });
      });
    });
  });

  describe('patient list edit', () => {
    it('edits a patient list', async () => {
      await transaction(PatientList.knex(), async txn => {
        const newTitle = 'Kingsguard';
        const newOrder = 1;
        const patientList = await PatientList.create(
          {
            title,
            answerId: answer1.id,
            order,
          },
          txn,
        );

        const mutation = `mutation {
          patientListEdit(input: {
            title: "${newTitle}"
            order: ${newOrder}
            answerId: "${answer2.id}"
            patientListId: "${patientList.id}"
          }) {
            id
            title
            answerId
            order
          }
        }`;

        const result = await graphql(schema, mutation, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientListEdit).toMatchObject({
          id: patientList.id,
          title: newTitle,
          answerId: answer2.id,
          order: newOrder,
        });
      });
    });
  });

  describe('patient list delete', () => {
    it('deletes a patient list', async () => {
      await transaction(PatientList.knex(), async txn => {
        const patientList = await PatientList.create(
          {
            title,
            answerId: answer1.id,
            order,
          },
          txn,
        );

        const mutation = `mutation {
          patientListDelete(input: { patientListId: "${patientList.id}"}) {
            id
          }
        }`;

        const result = await graphql(schema, mutation, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientListDelete).toMatchObject({
          id: patientList.id,
        });
      });
    });
  });
});