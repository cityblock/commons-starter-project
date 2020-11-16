import Item, { IItemInput } from '../models/item';

export async function resolverGetItem({}, args: { id: string }) {
    return Item.get(args.id);
}

export async function resolverCreateItem({}, input: IItemInput ){
    return Item.create(input);
}

export async function resolverEditItem({}, args: { id: string, input: IItemInput} ){
  return Item.edit(args.id, args.input);
}

export async function resolverDeleteItem({}, args: { id: string} ){
  return Item.delete(args.id);
}