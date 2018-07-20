import { transaction, Transaction } from 'objection';
import {
  IPokemonCreateInput,
  IPokemonDeleteInput,
  IPokemonEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import Pokemon from '../models/pokemon';

interface IQuery {
  pokemonId: string;
}

interface IContext {
  testTransaction: Transaction;
}

interface IPokemonCreateArgs {
  input: IPokemonCreateInput;
}

interface IPokemonEditArgs {
  input: IPokemonEditInput;
}

interface IPokemonDeleteArgs {
  input: IPokemonDeleteInput;
}

export async function resolvePokemon(
  // previous object, not used on root Query type
  root: {},
  // arguments provided to this field
  args: {},
  // context
  { testTransaction }: IContext,
): Promise<IRootQueryType['allPokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.getAll(txn);
  });
}

export async function resolveSinglePokemon(
  root: {},
  { pokemonId }: IQuery,
  { testTransaction }: IContext,
): Promise<IRootQueryType['singlePokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.get(pokemonId, txn);
  });
}

export async function pokemonCreate(
  root: any,
  { input }: IPokemonCreateArgs,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemonCreate']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.create(input, txn);
  });
}

export async function pokemonEdit(
  root: any,
  { input }: IPokemonEditArgs,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemonEdit']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.edit(
      input.pokemonId,
      {
        name: input.name || undefined,
        pokemonNumber: input.pokemonNumber || undefined,
        attack: input.attack || undefined,
        defense: input.defense || undefined,
        pokeType: input.pokeType || undefined,
        moves: input.moves || undefined,
        imageUrl: input.imageUrl || undefined,
      },
      txn,
    );
  });
}

export async function pokemonDelete(
  root: any,
  { input }: IPokemonDeleteArgs,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemonDelete']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.delete(input.pokemonId, txn);
  });
}
