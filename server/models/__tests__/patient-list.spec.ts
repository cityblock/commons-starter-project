import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createAnswerAssociations } from '../../spec-helpers';
import PatientList from '../patient-list';

describe('patient list model', () => {
  let txn = null as any;

  beforeAll(async () => {
    await Db.get();
    await Db.clear();
  });

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PatientList.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a patient list', async () => {
    const title = 'White Walkers';
    const order = 11;
    const { answer1 } = await createAnswerAssociations(txn);

    const patientList = await PatientList.create(
      {
        title,
        order,
        answerId: answer1.id,
      },
      txn,
    );

    expect(patientList.title).toBe(title);
    expect(await PatientList.get(patientList.id, txn)).toEqual(patientList);
  });

  it('throws an error if patient list does not exist for given id', async () => {
    const fakeId = uuid();
    await expect(PatientList.get(fakeId, txn)).rejects.toMatch(`No such patient list: ${fakeId}`);
  });

  it('gets all patient lists', async () => {
    const title1 = 'Free folk';
    const title2 = 'Lannister army';
    const title3 = 'Faceless men';
    const { answer1, answer2, answer3 } = await createAnswerAssociations(txn);

    const patientList1 = await PatientList.create(
      {
        title: title1,
        order: 1,
        answerId: answer1.id,
      },
      txn,
    );
    const patientList2 = await PatientList.create(
      {
        title: title2,
        order: 2,
        answerId: answer2.id,
      },
      txn,
    );
    const patientList3 = await PatientList.create(
      {
        title: title3,
        order: 3,
        answerId: answer3.id,
      },
      txn,
    );

    expect(await PatientList.getAll(txn)).toMatchObject([patientList1, patientList2, patientList3]);
  });

  it('edits a patient list', async () => {
    const title = 'Greyjoy crew';
    const { answer1, answer2 } = await createAnswerAssociations(txn);
    const patientList = await PatientList.create(
      {
        title,
        answerId: answer1.id,
        order: 1,
      },
      txn,
    );

    expect(patientList).toMatchObject({
      title,
      answerId: answer1.id,
    });

    const title2 = 'Golden Company';
    const editedPatientList = await PatientList.edit(
      {
        title: title2,
        answerId: answer2.id,
      },
      patientList.id,
      txn,
    );

    expect(editedPatientList).toMatchObject({
      title: title2,
      answerId: answer2.id,
    });
  });

  it('throws error when trying to edit with bogus id', async () => {
    const fakeId = uuid();
    const title = "Night's Watch";

    await expect(PatientList.edit({ title }, fakeId, txn)).rejects.toMatch(
      `No such patient list: ${fakeId}`,
    );
  });

  it('delets a patient list', async () => {
    const title = 'Northern army';
    const title2 = 'Dothraki horde';
    const { answer1, answer2 } = await createAnswerAssociations(txn);

    const patientList = await PatientList.create(
      {
        title,
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

    expect(patientList.deletedAt).toBeFalsy();
    const deleted = await PatientList.delete(patientList.id, txn);
    expect(deleted.deletedAt).toBeTruthy();

    expect(await PatientList.getAll(txn)).toMatchObject([patientList2]);
  });

  it('throws error when trying to delete with bogus id', async () => {
    const fakeId = uuid();
    await expect(PatientList.delete(fakeId, txn)).rejects.toMatch(
      `No such patient list: ${fakeId}`,
    );
  });
});
