import { transaction, Transaction } from 'objection';
import {
  IRootQueryType,
  IRootMutationType,
  IPokemonCreateFields,
  IPokemonDeleteInput,
  IPokemonEditInput,
} from 'schema';
import Pokemon from '../models/pokemon';

interface IContext {
  testTransaction: Transaction;
}

interface IQuery {
  pokemonId: string;
}

interface ICreatePokemon {
  input: IPokemonCreateFields;
}

interface IDeletePokemon {
  input: IPokemonDeleteInput;
}

interface IEditPokemon {
  input: IPokemonEditInput;
}

export async function resolvePokemon(
  root: {},
  args: {},
  { testTransaction }: IContext,
): Promise<IRootQueryType['pokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.getAll(txn);
  });
}

export async function resolveOnePokemon(
  root: {},
  { pokemonId }: IQuery,
  { testTransaction }: IContext,
): Promise<IRootQueryType['fullPokemon']> {
  return transaction(testTransaction || Pokemon.knex, async txn => {
    return Pokemon.get(pokemonId, txn);
  });
}

export async function createPokemon(
  root: {},
  { input }: ICreatePokemon,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemonCreate']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.create(input, txn);
  });
}

export async function deletePokemon(
  root: {},
  { input }: IDeletePokemon,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemonDelete']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.delete(input.pokemonId, txn);
  });
}

export async function editPokemon(
  root: {},
  { input }: IEditPokemon,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemonEdit']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.edit(
      input.pokemonId,
      {
        name: input.name || undefined,
        pokemonNumber: input.pokemonNumber || undefined,
        attack: input.attack || undefined,
        pokeType: input.pokeType || undefined,
        moves: input.moves || undefined,
      },
      txn,
    );
  });
}
