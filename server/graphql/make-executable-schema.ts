import fs from 'fs';
import { GraphQLDateTime } from 'graphql-iso-date';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import 'regenerator-runtime/runtime';
import config from '../config';
import { createItem, deleteItem, editItem, getItem } from './item-resolver';
import {
  createAPokemon,
  deletedAPokemon,
  editAPokemon,
  getAllPokemon,
  getOnePokemon,
} from './pokemon-resolver';

export const resolveFunctions = {
  DateTime: GraphQLDateTime,
  RootQueryType: { allPokemon: getAllPokemon, singlePokemon: getOnePokemon, singleItem: getItem },
  RootMutationType: {
    createPokemon: createAPokemon,
    editPokemon: editAPokemon,
    deletePokemon: deletedAPokemon,
    createItem,
    deleteItem,
    editItem,
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
