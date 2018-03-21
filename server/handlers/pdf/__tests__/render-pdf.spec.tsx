import * as httpMocks from 'node-mocks-http';
import { transaction, Transaction } from 'objection';
import * as React from 'react';
import 'regenerator-runtime/runtime';
import CBOReferral from '../../../../app/pdf/cbo-referral/cbo-referral';
import Db from '../../../db';
import { signJwt } from '../../../graphql/shared/utils';
import Clinic from '../../../models/clinic';
import Patient from '../../../models/patient';
import Task from '../../../models/task';
import User from '../../../models/user';
import {
  createCBOReferral,
  createMockClinic,
  createMockUser,
  createPatient,
} from '../../../spec-helpers';
import { formatCBOReferralTaskPdfFileName, formatPrintableMapPdfFileName } from '../helpers';
import {
  renderCBOReferralFormPdf,
  renderPdf,
  renderPrintableMapPdf,
  validateJWTForPdf,
  GENERATE_PDF_JWT_TYPE,
} from '../render-pdf';

const userRole = 'admin';

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

interface ISetup {
  task: any;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const cboReferral = await createCBOReferral(txn);
  const dueAt = new Date().toISOString();
  const task = await Task.create(
    {
      title: 'Defeat Night King',
      description: 'He has an army and a zombie dragon',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'high',
      CBOReferralId: cboReferral.id,
    },
    txn,
  );

  const fetchedTask = await Task.getForCBOReferralFormPDF(task.id, txn);

  return { task: fetchedTask, patient };
}

describe('handling PDF requests', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  const filename = 'aryaStark';

  describe('validateJWTForPdf', () => {
    it('returns false if no token provided', async () => {
      const result = await validateJWTForPdf(null);
      expect(result).toBeFalsy();
    });

    it('returns false if invalid token provided', async () => {
      const result = await validateJWTForPdf(EXPIRED_TOKEN);
      expect(result).toBeFalsy();
    });

    it('returns true if valid token provided', async () => {
      const result = await validateJWTForPdf(getAuthToken());
      expect(result).toBeTruthy();
    });
  });

  describe('renderPDF', () => {
    it('returns a PDF with relevant component and filename', async () => {
      const { task } = await setup(txn);
      const req = httpMocks.createRequest();
      req.query = { token: getAuthToken() };
      const res = httpMocks.createResponse();
      const result = await renderPdf(req, res, <CBOReferral task={task} />, filename);

      expect(result._headers).toMatchObject({
        'Content-type': 'application/pdf',
        'Content-Transfer-Encoding': 'binary',
        'Content-disposition': `inline; filename="${filename}.pdf"`,
      });
      expect(result.statusCode).toBe(200);
    });

    it('returns a 401 unauthorized if no token provided', async () => {
      const { task } = await setup(txn);
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      await renderPdf(req, res, <CBOReferral task={task} />, filename);

      expect(res.status).toBeCalledWith(401);
    });

    it('returns a 401 unauthorized if expired token provided', async () => {
      const { task } = await setup(txn);
      const req = httpMocks.createRequest();
      req.query = { token: EXPIRED_TOKEN };
      const res = httpMocks.createResponse();
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      await renderPdf(req, res, <CBOReferral task={task} />, filename);

      expect(res.status).toBeCalledWith(401);
    });
  });

  describe('renderCBOReferralFormPdf', () => {
    it('returns a PDF for CBO referral form', async () => {
      const { task } = await setup(txn);
      const req = httpMocks.createRequest();
      req.query = { token: getAuthToken() };
      req.params = { taskId: task.id };
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };

      const result = await renderCBOReferralFormPdf(req, res);
      const fileName = formatCBOReferralTaskPdfFileName(task);

      expect(result._headers).toMatchObject({
        'Content-type': 'application/pdf',
        'Content-Transfer-Encoding': 'binary',
        'Content-disposition': `inline; filename="${fileName}.pdf"`,
      });
      expect(result.statusCode).toBe(200);
    });

    it('returns a 404 not found if no task id provided', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      await renderCBOReferralFormPdf(req, res);

      expect(res.status).toBeCalledWith(404);
    });
  });

  describe('renderPrintableMapPdf', () => {
    it('returns a PDF for printable MAP', async () => {
      const { patient } = await setup(txn);
      const req = httpMocks.createRequest();
      req.query = { token: getAuthToken() };
      req.params = { patientId: patient.id };
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };

      const result = await renderPrintableMapPdf(req, res);
      const fileName = formatPrintableMapPdfFileName(patient);

      expect(result._headers).toMatchObject({
        'Content-type': 'application/pdf',
        'Content-Transfer-Encoding': 'binary',
        'Content-disposition': `inline; filename="${fileName}.pdf"`,
      });
      expect(result.statusCode).toBe(200);
    });

    it('returns a 404 not found if no patient id provided', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      await renderPrintableMapPdf(req, res);

      expect(res.status).toBeCalledWith(404);
    });
  });
});
