import 'fetch-everywhere';
import * as nock from 'nock';
import * as httpMocks from 'node-mocks-http';
import config from '../../../config';
import { checkRabbitHandler } from '../check-rabbit-handler';

describe('rabbit handler pingdom test', () => {
  let error: any;
  const { protocol, endpoint, port, user, pass, url } = config.rabbot[config.NODE_ENV].api;
  const rabbitResponse = [{ name: 'low-priority', messages_ready: 1 }];
  const bigQueueRabbitResponse = [{ name: 'low-priority', messages_ready: 301 }];

  beforeEach(async () => {
    error = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    nock.cleanAll();
    console.error = error;
  });

  describe('with connection issues', () => {
    it('returns a 500 with an appropriate message', async () => {
        const req = httpMocks.createRequest();
        const resp = httpMocks.createResponse();

        resp.status = jest.fn();
        (resp.status as any).mockReturnValueOnce({ send: jest.fn() });
        nock(`${protocol}://${user}:${pass}@${url}:${port}`)
          .get(endpoint)
          .reply(500);

        await checkRabbitHandler(req, resp);
        expect(resp.status).toBeCalledWith(500);
    });
  });

  describe('without connection issues', () => {
    describe('when the queues are too long', () => {
      it('returns a 500', async () => {
        const req = httpMocks.createRequest();
        const resp = httpMocks.createResponse();

        resp.status = jest.fn();
        (resp.status as any).mockReturnValueOnce({ send: jest.fn() });
        nock(`${protocol}://${user}:${pass}@${url}:${port}`)
          .get(endpoint)
          .reply(200, bigQueueRabbitResponse);

        await checkRabbitHandler(req, resp);
        expect(resp.status).toBeCalledWith(500);
      });
    });

    describe('when the queues are not too full', () => {
      it('returns a 200', async () => {
        const req = httpMocks.createRequest();
        const resp = httpMocks.createResponse();

        resp.sendStatus = jest.fn();
        nock(`${protocol}://${user}:${pass}@${url}:${port}`)
          .get(endpoint)
          .reply(200, rabbitResponse);

        await checkRabbitHandler(req, resp);
        expect(resp.sendStatus).toBeCalledWith(200);
      });
    });
  });
});
