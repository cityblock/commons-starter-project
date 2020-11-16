import fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import 'regenerator-runtime/runtime';
import config from '../config';

import {
  resolverCreateItem,
  resolverDeleteItem,
  resolverEditItem,
  resolverGetItem
} from './item-resolver';
import {
  resolverCreatePokemon,
  resolverDeletePokemon,
  resolverEditPokemon,
  resolverGetAllPokemon,
  resolverGetOnePokemon,
} from './pokemon-resolver';



export const resolveFunctions = {
  RootQueryType:  {
    readPokemons: resolverGetAllPokemon,
    readPokemon: resolverGetOnePokemon,
    readItem: resolverGetItem },
  RootMutationType: {
    createPokemon: resolverCreatePokemon,
    editPokemon: resolverEditPokemon,
    deletePokemon: resolverDeletePokemon,
    createItem: resolverCreateItem,
    deleteItem: resolverDeleteItem,
    editItem: resolverEditItem
  },

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
