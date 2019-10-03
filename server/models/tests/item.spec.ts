import { Transaction } from 'objection';
import { Item } from '../item';
import uuid from 'uuid/v4';

describe('get item for specific item id', () => {
  let txn = null as any;
  it('should create get an item with a specific id', async () => {
    const testItem = await Item.get('33fed58b-875d-40ed-a0cb-6aac515bee8c', txn);
    expect(testItem).toMatchObject({
      id: '33fed58b-875d-40ed-a0cb-6aac515bee8c',
      name: 'Focus Band',
      pokemonId: 'c478ee37-a40e-47cd-8c6a-0f57ef41ecd8',
      price: 90,
      happiness: 17,
      imageUrl: 'https://cdn.bulbagarden.net/upload/0/09/Dream_Choice_Band_Sprite.png',
      createdAt: new Date('2019-10-02 12:43:03.909-04'),
      updatedAt: new Date('2019-10-02 12:43:03.909-04'),
      deletedAt: null,
    });
  });
});

describe('get non existent item for non existent item id', () => {
  let txn = null as any;
  it('should not work', async () => {
    const testItem = await Item.get(uuid(), txn);
    expect(testItem).toBe(undefined);
  });
});

describe('create new item', () => {
  const txn = null as any;
  it('should create a new item', async () => {
    const currentTime = new Date(Date.now());
    const itemUUID = uuid();
    const pokemonUUID = 'ed972b83-8e6c-4857-8bfd-c5f83c43843c';
    const newItem = await Item.create(
      {
        id: itemUUID,
        name: 'DianaTestItem',
        pokemonId: pokemonUUID,
        price: 30,
        happiness: 14,
        imageUrl: 'https://www.cityblock.com/',
        createdAt: currentTime,
        updatedAt: currentTime,
        deletedAt: null,
      },
      txn,
    );
    expect(newItem).toMatchObject({
      id: itemUUID,
      name: 'DianaTestItem',
      pokemonId: pokemonUUID,
      price: 30,
      happiness: 14,
      imageUrl: 'https://www.cityblock.com/',
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: null,
    });
  });
});

describe('edit an item', () => {
  const txn = null as any;
  it('should edit an item', async () => {
    const allItems = await Item.getAll(txn);
    const randomInt = Math.floor(Math.random() * allItems.length);
    const randomItem = allItems[randomInt];
    const currentTime = new Date(Date.now());
    const fieldToEditValue = randomItem.price + 1;
    const editedItem = await Item.edit(
      randomItem.id,
      {
        price: fieldToEditValue,
        updatedAt: currentTime,
      },
      txn,
    );
    expect(editedItem).toMatchObject({
      id: randomItem.id,
      name: randomItem.name,
      pokemonId: randomItem.pokemonId,
      price: fieldToEditValue,
      happiness: randomItem.happiness,
      imageUrl: randomItem.imageUrl,
      createdAt: randomItem.createdAt,
      updatedAt: currentTime,
      deletedAt: null,
    });
  });
});

describe('test soft delete', () => {
  let txn = null as any;
  it('should soft delete a specific item', async () => {
    const itemToDeleteList = await Item.getNonDeletedItem(txn);
    const itemToDelete = itemToDeleteList[0];
    expect(itemToDelete.deletedAt).toBeNull();
    const deletedItem = await Item.delete(itemToDelete.id, txn);
    expect(deletedItem.deletedAt).toBeTruthy();
  });
});
