import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import { 
  IPokemonCreateOnRootMutationTypeArguments,
  IPokemonDeleteOnRootMutationTypeArguments,
  IPokemonEditInput,
  IPokemonEditOnRootMutationTypeArguments,
  IRootMutationType,
  IRootQueryType 
} from 'schema';
import Pokemon from '../models/pokemon';
import { IContext } from './shared/utils';

export async function getAllPokemon(
  {}: {},
  []: {},
  { testTransaction, getOrCreateTransaction }: IContext
): Promise<IRootQueryType['allPokemon']> {
  return getOrCreateTransaction(
    testTransaction, 
    async txn => Pokemon.getAll(txn)
  );
}

export async function getPokemon(
  {}: {},
  { pokemonId }: { pokemonId: string },
  { testTransaction, getOrCreateTransaction }: IContext
): Promise<IRootQueryType['pokemon']> {
  return getOrCreateTransaction(
    testTransaction, 
    async txn => Pokemon.get(pokemonId, txn)
  );
}

export async function pokemonCreate(
  {}: {},
  { input }: IPokemonCreateOnRootMutationTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext
): Promise<IRootMutationType['pokemonCreate']> {
  return getOrCreateTransaction(
    testTransaction, 
    async txn => Pokemon.create(input, txn)
  );
}

export async function pokemonEdit(
  {}: {},
  { input: { pokemonId, ...args } }: IPokemonEditOnRootMutationTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext
): Promise<IRootMutationType['pokemonEdit']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    const filteredArgs = omitBy<IPokemonEditInput>({ ...args, pokemonId }, isNil) as any;
    return Pokemon.edit(pokemonId, filteredArgs, txn);
  });
}

export async function pokemonDelete(
  {}: {},
  { input: { pokemonId } }: IPokemonDeleteOnRootMutationTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext
): Promise<IRootMutationType['pokemonDelete']> {
  return getOrCreateTransaction(
    testTransaction, 
    async txn => Pokemon.delete(pokemonId, txn)
  );
}
