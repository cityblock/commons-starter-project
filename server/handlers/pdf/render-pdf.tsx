import ReactPDF from '@react-pdf/node';
import * as express from 'express';
import * as React from 'react';
import { decodeJwt, IJWTForPDFData } from '../../graphql/shared/utils';
import CBOReferral from './cbo-referral/cbo-referral';
import { formatFilename } from './helpers';

export const REFERRAL_FILE_NAME = 'CBO_referral';
export const GENERATE_PDF_JWT_TYPE = 'generatePDFJwt';

export const validateJWTForPDF = async (token: string | null): Promise<boolean> => {
  let decoded = null;

  if (token) {
    try {
      decoded = await decodeJwt(token);
    } catch (err) {
      console.warn(err);
    }
  }

  return !!decoded && (decoded as IJWTForPDFData).type === GENERATE_PDF_JWT_TYPE;
};

export const renderPDF = async (
  req: express.Request,
  res: express.Response,
  component: React.ReactElement<any>,
  filename: string,
) => {
  const { token } = req.query;
  const isValidToken = await validateJWTForPDF(token || null);

  if (!isValidToken) {
    return res.status(401).send('Invalid token');
  }

  const formattedFilename = formatFilename(filename);
  res.setHeader('Content-disposition', formattedFilename);
  res.setHeader('Content-type', 'application/pdf');
  res.setHeader('Content-Transfer-Encoding', 'binary');

  return (await ReactPDF.renderToStream(component)).pipe(res);
};

export const renderCBOReferralFormPDF = async (req: express.Request, res: express.Response) => {
  return await renderPDF(req, res, <CBOReferral />, REFERRAL_FILE_NAME);
};
