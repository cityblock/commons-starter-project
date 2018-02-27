import ReactPDF from '@react-pdf/node';
import * as express from 'express';
import { transaction } from 'objection';
import * as React from 'react';
import CBOReferral from '../../../app/pdf/cbo-referral/cbo-referral';
import PrintableMAP from '../../../app/pdf/printable-map/printable-map';
import { decodeJwt, IJWTForPDFData } from '../../graphql/shared/utils';
import CareTeam from '../../models/care-team';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import Task from '../../models/task';
import {
  formatCBOReferralTaskPdfFileName,
  formatFilename,
  formatPrintableMAPPdfFileName,
} from './helpers';
import { clearFonts, registerFonts } from './register-fonts';

export const GENERATE_PDF_JWT_TYPE = 'generatePDFJwt';
const SERVER_ERROR_MESSAGE = 'Something went wrong, please try again';

export const validateJWTForPdf = async (token: string | null): Promise<boolean> => {
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

export const renderPdf = async (
  req: express.Request,
  res: express.Response,
  component: React.ReactElement<any>,
  filename: string,
) => {
  const { token } = req.query;
  const isValidToken = await validateJWTForPdf(token || null);

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

export const renderCBOReferralFormPdf = async (req: express.Request, res: express.Response) => {
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
    return await renderPdf(
      req,
      res,
      <CBOReferral task={task} />,
      formatCBOReferralTaskPdfFileName(task),
    );
  } catch (err) {
    console.warn(err);
    return res.status(500).send(SERVER_ERROR_MESSAGE);
  }
};

export const renderPrintableMAPPdf = async (req: express.Request, res: express.Response) => {
  const existingTxn = res.locals.existingTxn;
  const { patientId } = req.params;
  let result: any[] = [];

  if (patientId) {
    await transaction(Patient.knex(), async txn => {
      const promises = [
        PatientConcern.getForPatient(patientId, existingTxn || txn),
        CareTeam.getForPatient(patientId, existingTxn || txn),
        Patient.get(patientId, existingTxn || txn),
      ];

      result = await Promise.all(promises as any);
    });
  }

  const carePlan = result[0];
  const careTeam = result[1];
  const patient = result[2];

  if (!patientId || !carePlan || !careTeam || !patient) {
    return res.status(404).send('Care plan not found');
  }

  try {
    return await renderPdf(
      req,
      res,
      <PrintableMAP carePlan={carePlan} careTeam={careTeam} patient={patient} />,
      formatPrintableMAPPdfFileName(patient),
    );
  } catch (err) {
    console.warn(err);
    return res.status(500).send(SERVER_ERROR_MESSAGE);
  }
};
