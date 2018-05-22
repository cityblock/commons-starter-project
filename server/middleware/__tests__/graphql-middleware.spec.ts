import * as httpMocks from 'node-mocks-http';
import { transaction } from 'objection';
import User from '../../models/user';
import { graphqlMiddleware } from '../graphql-middleware';

describe('graphqlMiddleware', () => {
  it.only('does not error on setup', async () => {
    const request = httpMocks.createRequest({
      headers: {
        auth_token: 'foo',
      },
    });
    const response = httpMocks.createResponse();
    response.send = jest.fn();
    response.sendStatus = jest.fn();
    response.write = jest.fn();
    const next = jest.fn();
    const logFn = jest.fn();
    const reportFn = jest.fn();
    const logger = { log: logFn } as any;
    const errorReporting = { report: reportFn } as any;
    const txn = await transaction.start(User.knex());

    await graphqlMiddleware(request, response, next, logger, errorReporting, txn);
    expect(response.write).toBeCalledWith('foo');
  });
});
