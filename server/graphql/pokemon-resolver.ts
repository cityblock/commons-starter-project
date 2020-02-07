import { transaction } from "objection";
import {
  ICreatePokemonOnRootMutationTypeArguments,
  IPokemonOnRootQueryTypeArguments,
  IRootMutationType,
  IRootQueryType
} from "schema";
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

export async function resolveCreatePokemon(
  root: any,
  { input }: ICreatePokemonOnRootMutationTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootMutationType['createPokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.create(input, txn);
  });
};