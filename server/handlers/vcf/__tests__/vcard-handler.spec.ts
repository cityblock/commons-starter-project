import * as httpMocks from 'node-mocks-http';
import { signJwt } from '../../../graphql/shared/utils';
import { contactsVcfHandler, validateJwtForVcf } from '../vcard-handler';

const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiZ2VuZXJhdGVQREZKd3QiLCJpYXQiOjE1MTczMzcwNDUsImV4cCI6MTUxNzMzNzM0NX0.4OG2ho0S5Wj074KpcEP4Qpdqdj2jZ8Kh4rjBtH2kigU';

const getAuthToken = (): string => {
  const jwtData = {
    createdAt: new Date().toISOString(),
    userId: 'jonSnow',
  };

  return signJwt(jwtData, '10m');
};

describe('vCard Handler', () => {
  describe('validateJwtForVcf', () => {
    it('returns false if no token provided', async () => {
      const result = await validateJwtForVcf(null);
      expect(result).toBeFalsy();
    });

    it('returns false if invalid token provided', async () => {
      const result = await validateJwtForVcf(EXPIRED_TOKEN);
      expect(result).toBeFalsy();
    });

    it('returns true if valid token provided', async () => {
      const result = await validateJwtForVcf(getAuthToken());
      expect(result).toBeTruthy();
    });
  });

  describe('contactsVcfHandler', () => {
    it('returns a 401 unauthorized if no token provided', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      await contactsVcfHandler(req, res);

      expect(res.status).toBeCalledWith(401);
    });

    it('returns a 401 unauthorized if expired token provided', async () => {
      const req = httpMocks.createRequest();
      req.query = { token: EXPIRED_TOKEN };
      const res = httpMocks.createResponse();
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      await contactsVcfHandler(req, res);

      expect(res.status).toBeCalledWith(401);
    });
  });
});
