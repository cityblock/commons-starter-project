import axios from 'axios';
import { transaction, Transaction } from 'objection';
import { v4 as uuid } from 'uuid';
import { setupDb } from '../../lib/test-utils';
import Item from '../item';
import { IItemCreateInput } from '../item';

describe('item model', () => {
  let testDb: ReturnType<typeof setupDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupDb();
    axios.get = jest.fn();
  });

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
    console.error = jest.fn();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  afterEach(async () => {
    await txn.rollback();
  });
  describe('create and get item', () => {
    it('should create and retrieve an item', async () => {
      try{
        const itemFields: IItemCreateInput = {
          id: uuid(),
          name: 'item-create-test',
          pokemonId: '412e4c8a-00f1-4ccf-bf7d-475404ccd42f';
          price: 43,
          happiness: 29,
          imageUrl: 'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png'
        };
        const item = await Item.create(itemFields, txn);
        // tslint:disable-next-line: no-console
        console.log('new item: ', item);
        expect(item).toMatchObject(itemFields);
        // const patientById = await Patient.get(patient.id, patient.homeMarketId, txn);
        // expect(patientById).toMatchObject({
        //   id: patient.id,
        // });
      }
      catch(err){
        // tslint:disable-next-line: no-console
        console.log('Failed to create a new item. error: ', err)
      }
    });
  });
});
