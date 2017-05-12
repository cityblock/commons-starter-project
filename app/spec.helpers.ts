import 'fetch-everywhere';
import * as nock from 'nock';
import { API_URL } from './config';

export function restoreGraphQLFetch() {
  nock.cleanAll();
}

export function mockGraphQLFetch(response: any) {
  nock('https://localhost:3000')
    .post(API_URL)
    .reply(200, [response]); // Array here to match what apollo-client batchMiddleware expects
}
