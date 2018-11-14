import fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import 'regenerator-runtime/runtime';
import config from '../config';
import {
  resolveAllItem,
  // resolveCreatePokemon,
  // resolveDeletePokemon,
  // resolveEditPokemon,
  // resolvePokemon,
} from './item-resolver';
import {
  resolveAllPokemon,
  resolveCreatePokemon,
  resolveDeletePokemon,
  resolveEditPokemon,
  resolvePokemon,
} from './pokemon-resolver';

const schemaGql = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

const resolveFunctions = {
  RootQueryType: {
    allPokemon: resolveAllPokemon,
    pokemon: resolvePokemon,
    allItem: resolveAllItem,
  },
  RootMutationType: {
    pokemonEdit: resolveEditPokemon,
    pokemonCreate: resolveCreatePokemon,
    pokemonDelete: resolveDeletePokemon,
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

const schema = makeExecutableSchema({
  typeDefs: schemaGql,
  resolvers: resolveFunctions,
  logger,
} as any);

export default schema;
