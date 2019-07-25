import { graphql, print } from 'graphql';
import { transaction } from 'objection';
import getItem from '../../../app/graphql/queries/get-item.graphql';
import itemCreate from '../../../app/graphql/queries/item-create-mutation.graphql';
import itemDelete from '../../../app/graphql/queries/item-delete-mutation.graphql';
import itemEdit from '../../../app/graphql/queries/item-edit-mutation.graphql';
import { 
  filterTimestamps, 
  getRandomItemId, 
  getRandomPokemonId, 
  setupDb, 
  testGraphqlContext 
} from '../../lib/test-utils';
import Item from '../../models/item';
import schema from '../make-executable-schema';

describe('Item Resolver', () => {
  let testDb = null as any;
  let txn = null as any;

  const getItemQuery = print(getItem);
  const itemCreateMutation = print(itemCreate);
  const itemEditMutation = print(itemEdit);
  const itemDeleteMutation = print(itemDelete);

  const filterItem = ({ pokemon, ...item }: Item) => ({
    ...filterTimestamps(item),
    pokemon: filterTimestamps(pokemon)
  });

  beforeAll(() => testDb = setupDb());

  afterAll(() => testDb.destroy());

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
  });

  afterEach(() => txn.rollback());

  describe('getItem', () => {
    it('fetches the requested item', async () => {
      const itemId = await getRandomItemId(txn);
      const dbItem = await Item.get(itemId, txn);
      const filteredDbItem = filterItem(dbItem);

      const { data: { item: graphQLItem } }: any = await graphql(
        schema,
        getItemQuery,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { itemId }
      );

      expect(graphQLItem).toMatchObject(filteredDbItem);
    });
  });

  describe('itemCreate', () => {
    it('creates a new item', async () => {
      const pokemonId = await getRandomPokemonId(txn);

      const { data: { itemCreate: createdItem } }: any = await graphql(
        schema,
        itemCreateMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {
          pokemonId,
          name: 'Air Balloon',
          price: 50,
          happiness: 4,
          imageUrl: 'https://aster.fyi'
        }
      );

      const dbItem = await Item.get(createdItem.id, txn);
      const filteredDbItem = filterItem(dbItem);

      expect(createdItem).toMatchObject(filteredDbItem);
    });
  });

  describe('itemEdit', () => {
    it('edits and returns an item', async () => {
      const itemId = await getRandomItemId(txn);
      
      const { data: { itemEdit: editedItem } }: any = await graphql(
        schema,
        itemEditMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { itemId, price: 5000 }
      );

      expect(editedItem).toMatchObject({ price: 5000 });
    });

    it('saves the edit in the database', async () => {
      const itemId = await getRandomItemId(txn);
      
      const { data: { itemEdit: editedItem } }: any = await graphql(
        schema,
        itemEditMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { itemId, price: 5000 }
      );

      const dbItem = await Item.get(itemId, txn);
      const filteredDbItem = filterItem(dbItem);

      expect(editedItem).toMatchObject(filteredDbItem);
    });
  });

  describe('itemDelete', () => {
    it('marks an item as deleted and returns it', async () => {
      const itemId = await getRandomItemId(txn);

      const { data: { itemDelete: deletedItem } }: any = await graphql(
        schema,
        itemDeleteMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { itemId }
      );

      expect(deletedItem.deletedAt).not.toBeNull();
    });

    it('marks the item as deleted in the database', async () => {
      const itemId = await getRandomItemId(txn);
      await graphql(
        schema,
        itemDeleteMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { itemId }
      );

      const dbItem = await Item.query(txn).findById(itemId);
      expect(dbItem!.deletedAt).not.toBeNull();
    });
  });
});
