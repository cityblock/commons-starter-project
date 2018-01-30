import * as httpMocks from 'node-mocks-http';
import * as React from 'react';
import 'regenerator-runtime/runtime';
import CBOReferral from '../cbo-referral/cbo-referral';
import { renderCBOReferralFormPDF, renderPDF, REFERRAL_FILE_NAME } from '../render-pdf';

describe('handling PDF requests', () => {
  const filename = 'aryaStark';

  describe('renderPDF', () => {
    it('returns a PDF with relevant component and filename', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const result = await renderPDF(req, res, <CBOReferral />, filename);

      expect(result._headers).toMatchObject({
        'Content-type': 'application/pdf',
        'Content-Transfer-Encoding': 'binary',
        'Content-disposition': `inline; filename="${filename}.pdf"`,
      });
      expect(result.statusCode).toBe(200);
    });
  });

  describe('renderCBOReferralFormPDF', () => {
    it('returns a PDF for CBO referral form', async () => {
      const req = httpMocks.createRequest();
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
