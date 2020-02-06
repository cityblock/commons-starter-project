import { transaction } from "objection";
import { IRootQueryType } from "schema";
import Pokemon from "../models/pokemon";


export const resolveGetPokemons = async (
  root: any,
  args: any,
): Promise<IRootQueryType['pokemons']> => {
  return transaction(Pokemon.knex(), async txn => {
    return Pokemon.getAll(txn);
  });
};