import ReactPDF from '@react-pdf/node';
import * as express from 'express';
import * as React from 'react';
import CBOReferral from './cbo-referral/cbo-referral';
import { formatFilename } from './helpers';

export const REFERRAL_FILE_NAME = 'CBO_referral';

export const renderPDF = async (
  req: express.Request,
  res: express.Response,
  component: React.ReactElement<any>,
  filename: string,
) => {
  const formattedFilename = formatFilename(filename);
  res.setHeader('Content-disposition', formattedFilename);
  res.setHeader('Content-type', 'application/pdf');
  res.setHeader('Content-Transfer-Encoding', 'binary');

  return (await ReactPDF.renderToStream(component)).pipe(res);
};

export const renderCBOReferralFormPDF = async (req: express.Request, res: express.Response) => {
  return await renderPDF(req, res, <CBOReferral />, REFERRAL_FILE_NAME);
};
