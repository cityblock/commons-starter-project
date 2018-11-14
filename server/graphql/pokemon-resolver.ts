import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'objection';
import { IRootMutationType, IRootQueryType } from 'schema';
import Pokemon from '../models/pokemon';

export const resolveAllPokemon = async (
  root: {},
  args: {},
  context: Transaction,
  info: {},
): Promise<IRootQueryType['allPokemon']> => Pokemon.getAll(context);

export const resolvePokemon = async (
  root: {},
  args: {},
  context: Transaction,
  { variableValues }: GraphQLResolveInfo,
): Promise<IRootQueryType['pokemon']> => Pokemon.get(variableValues.pokemonId, context);

export const resolveEditPokemon = async (
  root: {},
  args: {},
  context: Transaction,
  { variableValues }: any,
): Promise<IRootMutationType['pokemonEdit']> =>
  Pokemon.edit(variableValues.id, variableValues, context);

export const resolveCreatePokemon = async (
  root: {},
  args: {},
  context: Transaction,
  { variableValues }: any,
): Promise<IRootMutationType['pokemonCreate']> => {
  const newPoke = await Pokemon.create(variableValues, context);
  return newPoke;
};

export const resolveDeletePokemon = async (
  root: {},
  args: {},
  context: Transaction,
  { variableValues: { id } }: any,
): Promise<IRootMutationType['pokemonDelete']> => Pokemon.delete(id, context);
