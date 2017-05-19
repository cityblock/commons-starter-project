import { AthenaResponseError } from '../errors';

describe('AthenaResponseError', () => {
  it('sets a message, status, and endopint', async () => {
    const error = new AthenaResponseError('message', '/patients', 503);

    expect(error.message).toEqual('message');
    expect(error.endpoint).toEqual('/patients');
    expect(error.status).toEqual(503);
  });
});
