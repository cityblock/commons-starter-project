import { get as httpGet, IncomingMessage } from 'http';
import Db from '../db';

import config from '../config';
import { main } from '../index';

config.PORT = 3001;  // Use a different route for testing than serving.

const GRAPHQL_ROUTE = '/graphql';

const getFromServer = async (uri: string, basicAuthString?: string) => (
  new Promise<IncomingMessage>((resolve, reject) => {
    httpGet(`http://localhost:${config.PORT}${uri}`, resolve).on('error', reject);
  })
);

describe('main', () => {
  let db: Db = null as any;

  beforeAll(async () => {
    db = await Db.get();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should be able to Initialize a server (production)', async () => {
    const server = await main({ env: 'production' });
    server.close();
  });

  it('should have a working GET graphql (production)', async () => {
    const server = await main({ env: 'production' });
    const res = await getFromServer(GRAPHQL_ROUTE);
    expect(res.statusCode).toBe(400);
    server.close();
  });
});
