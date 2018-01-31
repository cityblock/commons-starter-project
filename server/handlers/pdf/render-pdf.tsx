import ReactPDF from '@react-pdf/node';
import * as express from 'express';
import { transaction } from 'objection';
import * as React from 'react';
import CBOReferral from '../../../app/pdf/cbo-referral/cbo-referral';
import { decodeJwt, IJWTForPDFData } from '../../graphql/shared/utils';
import Task from '../../models/task';
import { formatCBOReferralTaskPDFFileName, formatFilename } from './helpers';
import { clearFonts, registerFonts } from './register-fonts';

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

  // For now have to load and clear fonts each time, otherwise crashes on multiple loads
  registerFonts();
  const pdf = await ReactPDF.renderToStream(component);
  clearFonts();

  return pdf.pipe(res);
};

export const renderCBOReferralFormPDF = async (req: express.Request, res: express.Response) => {
  const existingTxn = res.locals.existingTxn;
  const { taskId } = req.params;
  let task = null;

  if (taskId) {
    await transaction(Task.knex(), async txn => {
      task = await Task.getForCBOReferralFormPDF(taskId, existingTxn || txn);
    });
  }

  if (!task) {
    return res.status(404).send('Task not found');
  }

  try {
    return await renderPDF(
      req,
      res,
      <CBOReferral task={task} />,
      formatCBOReferralTaskPDFFileName(task),
    );
  } catch (err) {
    console.warn(err);
    return res.status(500).send('Something went wrong, please try again');
  }
};
