import { transaction } from "objection";
import { IPokemonOnRootQueryTypeArguments, IRootQueryType } from "schema";
import Pokemon from "../models/pokemon";
import { IContext } from "./shared/utils";


export async function resolveGetPokemons(
  root: any,
  args: any,
  { testTransaction }: IContext,
): Promise<IRootQueryType['pokemons']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.getAll(txn);
  });
};

export async function resolveGetPokemon(
  root: any,
  { pokemonId }: IPokemonOnRootQueryTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootQueryType['pokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.get(pokemonId, txn);
  });
};