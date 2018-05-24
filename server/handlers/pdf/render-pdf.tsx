import ReactPDF from '@react-pdf/node';
import { addMonths, subDays } from 'date-fns';
import * as express from 'express';
import { transaction } from 'objection';
import * as React from 'react';
import { PatientSignedUrlAction } from 'schema';
import CBOReferral from '../../../app/pdf/cbo-referral/cbo-referral';
import PrintableCalendar from '../../../app/pdf/printable-calendar/printable-calendar';
import PrintableMAP from '../../../app/pdf/printable-map/printable-map';
import { loadPatientPhotoUrl } from '../../graphql/shared/gcs/helpers';
import { decodeJwt, IJWTForPDFData } from '../../graphql/shared/utils';
import { getGoogleCalendarEventsForPatient } from '../../helpers/google-calendar-helpers';
import CareTeam from '../../models/care-team';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import Task from '../../models/task';
import {
  formatCBOReferralTaskPdfFileName,
  formatFilename,
  formatPrintableCalendarPdfFileName,
  formatPrintableMapPdfFileName,
} from './helpers';
import { registerFonts } from './register-fonts';

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

  // Ensure fonts are registered
  registerFonts();
  const pdf = await ReactPDF.renderToStream(component);

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

export const renderPrintableMapPdf = async (req: express.Request, res: express.Response) => {
  const existingTxn = res.locals.existingTxn;
  const { patientId } = req.params;
  let result: any[] = [];

  if (patientId) {
    await transaction(Patient.knex(), async txn => {
      const promises = [
        PatientConcern.getForPatient(patientId, existingTxn || txn),
        CareTeam.getCareTeamRecordsForPatient(patientId, existingTxn || txn),
        Patient.get(patientId, existingTxn || txn),
      ];

      result = await Promise.all(promises as any);
    });
  }

  const carePlan = result[0];
  const careTeam = result[1]
    ? result[1].map((careTeamRecord: CareTeam) => ({
        ...careTeamRecord.user,
        isCareTeamLead: careTeamRecord.isCareTeamLead,
      }))
    : null;
  const patient = result[2];

  if (!patientId || !carePlan || !careTeam || !patient) {
    return res.status(404).send('Care plan not found');
  }

  let profilePhotoUrl = null;
  if (patient.patientInfo.hasUploadedPhoto) {
    profilePhotoUrl = await loadPatientPhotoUrl(patientId, 'read' as PatientSignedUrlAction);
  }

  try {
    return await renderPdf(
      req,
      res,
      <PrintableMAP
        carePlan={carePlan}
        careTeam={careTeam}
        patient={patient}
        profilePhotoUrl={profilePhotoUrl}
      />,
      formatPrintableMapPdfFileName(patient),
    );
  } catch (err) {
    console.warn(err);
    return res.status(500).send(SERVER_ERROR_MESSAGE);
  }
};

export const renderPrintableCalendarPdf = async (req: express.Request, res: express.Response) => {
  const existingTxn = res.locals.existingTxn;
  const { patientId, year, month } = req.params;
  let result: any[] = [];

  if (patientId) {
    await transaction(Patient.knex(), async txn => {
      const promises = [
        CareTeam.getCareTeamRecordsForPatient(patientId, existingTxn || txn),
        Patient.get(patientId, existingTxn || txn),
      ];

      result = await Promise.all(promises as any);
    });
  }

  const careTeam = result[0]
    ? result[0].map((careTeamRecord: CareTeam) => ({
        ...careTeamRecord.user,
        isCareTeamLead: careTeamRecord.isCareTeamLead,
      }))
    : null;
  const patient = result[1];

  if (!patientId || !careTeam || !patient) {
    return res.status(404).send('Patient not found');
  }
  if (!patient.patientInfo.googleCalendarId) {
    return res.status(404).send("Patient doesn't have calendar");
  }

  const startDate = new Date(year, month, 1);
  const endDate = subDays(addMonths(startDate, 1), 1);

  const { events } = await getGoogleCalendarEventsForPatient(
    {
      calendarId: patient.patientInfo.googleCalendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
    },
    { pageSize: 30, pageToken: null },
  );

  let profilePhotoUrl = null;
  if (patient.patientInfo.hasUploadedPhoto) {
    profilePhotoUrl = await loadPatientPhotoUrl(patientId, 'read' as PatientSignedUrlAction);
  }

  try {
    return await renderPdf(
      req,
      res,
      <PrintableCalendar
        events={events}
        month={month}
        year={year}
        careTeam={careTeam}
        patient={patient}
        profilePhotoUrl={profilePhotoUrl}
      />,
      formatPrintableCalendarPdfFileName(patient, startDate),
    );
  } catch (err) {
    console.warn(err);
    return res.status(500);
  }
};
