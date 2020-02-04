import { transaction } from "objection";
import { IRootQueryType } from "schema";
import Pokemon from "../models/pokemon";


export const resolveGetAllPokemon = async (
  root: any,
  args: any,
): Promise<IRootQueryType['allPokemon']> => {
  return transaction(Pokemon.knex(), async txn => {
    return Pokemon.getAll(txn);
  });
};