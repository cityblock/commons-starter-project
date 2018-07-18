import { transaction, Transaction } from 'objection';
import { IPokemonCreateInput, IPokemonEditInput, IRootMutationType, IRootQueryType } from 'schema';
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
  return transaction(testTransaction || Pokemon.knex, async txn => {
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
  console.log(`the input is ${input}`);
  // return transaction(testTransaction || Pokemon.knex(), async txn => {
  //   console.log(`the input is ${input}`);
  //   // return Pokemon.edit(input.pokemonId, input, txn);
  // });
}
