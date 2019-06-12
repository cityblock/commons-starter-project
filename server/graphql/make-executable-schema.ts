import fs from 'fs';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import 'regenerator-runtime/runtime';
import config from '../config';
import { itemCreate, itemDelete, itemEdit, resolveItem } from './item-resolver';
import {
  pokemonCreate,
  // pokemonDelete,
  // pokemonEdit,
  resolvePokemon,
  resolvePokemons,
} from './pokemon-resolver';

export const resolveFunctions = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
  RootQueryType: {
    pokemon: resolvePokemon,
    pokemons: resolvePokemons,
    item: resolveItem,
  },
  RootMutationType: {
    pokemonCreate,
    // pokemonDelete,
    // pokemonEdit,
    itemCreate,
    itemDelete,
    itemEdit,
  },
  // From https://github.com/apollographql/graphql-tools/pull/698
  uniqueId: {
    __resolveType: ({ type }: { type: string }) => type,
  },
};

const logger = {
  log: (e: any) => {
    if (config.NODE_ENV !== 'test' && config.NODE_ENV !== 'production') {
      /* tslint:disable no-console */
      console.log(e);
      /* tslint:enable no-console */
    }
  },
};

const schemaGql = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

export default makeExecutableSchema({
  typeDefs: schemaGql,
  resolvers: resolveFunctions,
  logger,
} as any);
