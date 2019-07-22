import { transaction } from 'objection';
import {
  ICreatePokemonOnRootMutationTypeArguments as ICreatePokemon,
  IEditPokemonOnRootMutationTypeArguments as IEditPokemon,
  IRootMutationType,
} from 'schema';
import Pokemon from '../models/pokemon';
import { IContext } from './shared/utils';

export async function getAllPokemon(root: {}, args: {}, { testTransaction }: IContext) {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const allPokemon = await Pokemon.getAll(txn);
    return allPokemon;
  });
}

export async function getOnePokemon(
  root: {},
  args: { pokemonId: string },
  { testTransaction }: IContext,
) {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const onePokemon = await Pokemon.get(args.pokemonId, txn);
    return onePokemon;
  });
}

export async function createAPokemon(
  root: {},
  { input }: ICreatePokemon,
  { testTransaction }: IContext,
): Promise<IRootMutationType['createPokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const createdPokemon = await Pokemon.create({ ...input }, txn);
    return createdPokemon;
  });
}

export async function editAPokemon(
  root: {},
  { input }: IEditPokemon,
  { testTransaction }: IContext,
): Promise<IRootMutationType['editPokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const editedPokemon = await Pokemon.edit(input.id, { ...input }, txn);
    return editedPokemon;
  });
}

export async function deletedAPokemon(
  root: {},
  args: { pokemonId: string },
  { testTransaction }: IContext,
): Promise<IRootMutationType['deletePokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.delete(args.pokemonId, txn);
  });
}
