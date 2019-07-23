import fs from 'fs';
import { GraphQLDateTime } from 'graphql-iso-date';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import 'regenerator-runtime/runtime';
import { 
  getAllPokemon, 
  getPokemon,
  pokemonCreate,
  pokemonEdit,
  pokemonDelete
} from './pokemon-resolver';
import config from '../config';

export const resolveFunctions = {
  DateTime: GraphQLDateTime,
  RootQueryType: {
    getAllPokemon: getAllPokemon,
    pokemon: getPokemon
  },
  RootMutationType: {
    pokemonCreate,
    pokemonEdit,
    pokemonDelete
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
