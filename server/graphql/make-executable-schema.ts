import fs from 'fs';
import { GraphQLDateTime } from 'graphql-iso-date';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import 'regenerator-runtime/runtime';
import config from '../config';
import {
  resolveCreateItem,
  resolveDeleteItem,
  resolveEditItem,
  resolveGetItem,
} from './item-resolver';
import {
  resolveCreatePokemon,
  resolveDeletePokemon,
  resolveEditPokemon,
  resolveGetPokemon,
  resolveGetPokemons
} from './pokemon-resolver';

export const resolveFunctions = {
  DateTime: GraphQLDateTime,
  RootQueryType: {
    pokemons: resolveGetPokemons,
    pokemon: resolveGetPokemon,
    item: resolveGetItem,
  },
  RootMutationType: {
    createPokemon: resolveCreatePokemon,
    editPokemon: resolveEditPokemon,
    deletePokemon: resolveDeletePokemon,
    createItem: resolveCreateItem,
    editItem: resolveEditItem,
    deleteItem: resolveDeleteItem,
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
