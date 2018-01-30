import * as httpMocks from 'node-mocks-http';
import * as React from 'react';
import 'regenerator-runtime/runtime';
import { signJwt, IJWTForPDFData } from '../../../graphql/shared/utils';
import CBOReferral from '../cbo-referral/cbo-referral';
import {
  renderCBOReferralFormPDF,
  renderPDF,
  validateJWTForPDF,
  GENERATE_PDF_JWT_TYPE,
  REFERRAL_FILE_NAME,
} from '../render-pdf';

const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiZ2VuZXJhdGVQREZKd3QiLCJpYXQiOjE1MTczMzcwNDUsImV4cCI6MTUxNzMzNzM0NX0.4OG2ho0S5Wj074KpcEP4Qpdqdj2jZ8Kh4rjBtH2kigU';

const getAuthToken = (): string => {
  const jwtData = {
    type: GENERATE_PDF_JWT_TYPE,
    createdAt: new Date().toISOString(),
    userId: 'jonSnow',
  };

  return signJwt(jwtData, '10m');
};

describe('handling PDF requests', () => {
  const filename = 'aryaStark';
  const token = 'isFacelessMan';

  describe('validateJWTForPDF', () => {
    it('returns false if no token provided', async () => {
      const result = await validateJWTForPDF(null);
      expect(result).toBeFalsy();
    });

    it('returns false if invalid token provided', async () => {
      const result = await validateJWTForPDF(EXPIRED_TOKEN);
      expect(result).toBeFalsy();
    });

    it('returns true if valid token provided', async () => {
      const result = await validateJWTForPDF(getAuthToken());
      expect(result).toBeTruthy();
    });
  });

  describe('renderPDF', () => {
    it('returns a PDF with relevant component and filename', async () => {
      const req = httpMocks.createRequest();
      req.query = { token: getAuthToken() };
      const res = httpMocks.createResponse();
      const result = await renderPDF(req, res, <CBOReferral />, filename);

      expect(result._headers).toMatchObject({
        'Content-type': 'application/pdf',
        'Content-Transfer-Encoding': 'binary',
        'Content-disposition': `inline; filename="${filename}.pdf"`,
      });
      expect(result.statusCode).toBe(200);
    });

    it('returns a 401 unauthorized if no token provided', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      const result = await renderPDF(req, res, <CBOReferral />, filename);

      expect(res.status).toBeCalledWith(401);
    });

    it('returns a 401 unauthorized if expired token provided', async () => {
      const req = httpMocks.createRequest();
      req.query = { token: EXPIRED_TOKEN };
      const res = httpMocks.createResponse();
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      const result = await renderPDF(req, res, <CBOReferral />, filename);

      expect(res.status).toBeCalledWith(401);
    });
  });

  describe('renderCBOReferralFormPDF', () => {
    it('returns a PDF for CBO referral form', async () => {
      const req = httpMocks.createRequest();
      req.query = { token: getAuthToken() };
      const res = httpMocks.createResponse();

      const result = await renderCBOReferralFormPDF(req, res);

      expect(result._headers).toMatchObject({
        'Content-type': 'application/pdf',
        'Content-Transfer-Encoding': 'binary',
        'Content-disposition': `inline; filename="${REFERRAL_FILE_NAME}.pdf"`,
      });
      expect(result.statusCode).toBe(200);
    });
  });
});
