import * as dotenv from 'dotenv';
dotenv.config();

import * as Knex from 'knex';
import * as kue from 'kue';
import { transaction, Model, Transaction } from 'objection';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import { formatAbbreviatedName } from '../helpers/format-helpers';
import { createRedisClient } from '../lib/redis';
import Logging from '../logging';
import CareTeam from '../models/care-team';
import Patient from '../models/patient';
import User from '../models/user';
import TwilioClient from '../twilio-client';

/* tslint:disable no-var-requires */
const knexConfig = require('../models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

type PatientContactEdit = 'addPhoneNumber' | 'editPhoneNumber' | 'deletePhoneNumber';

interface IProcessPatientContactEditData {
  patientId: string;
  type: PatientContactEdit;
}

type NoticeCopyVerbs = {
  [K in PatientContactEdit]: string;
};

const noticeCopyVerbs: NoticeCopyVerbs = {
  addPhoneNumber: 'added to',
  editPhoneNumber: 'updated in',
  deletePhoneNumber: 'deleted in',
};

const queue = kue.createQueue({ redis: createRedisClient() });

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

queue.process('patientContactEdit', async (job, done) => {
  try {
    logger.log('[Consumer][patientContactEdit] Started processing');
    await processPatientContactEdit(job.data);
    logger.log('[Consumer][patientContactEdit] Completed processing');
    return done();
  } catch (err) {
    logger.log('[Consumer][patientContactEdit] Error processing');
    reportError(err, 'Kue error patientContactEdit');

    return done(err);
  }
});

queue.on('error', err => {
  reportError(err, 'Kue uncaught error');
});

export async function processPatientContactEdit(
  data: IProcessPatientContactEditData,
  existingTxn?: Transaction,
): Promise<void> {
  await transaction(existingTxn || Patient.knex(), async txn => {
    const patient = await Patient.get(data.patientId, txn);
    const careTeam = await CareTeam.getForPatient(data.patientId, txn);
    const noticeCopy = getNoticeCopy(patient, data.type);
    const actionCopy = getActionCopy(patient, data.type);

    careTeam.forEach(async user => {
      await notifyUserOfContactEdit(user, noticeCopy, actionCopy);
    });
  });
}

export async function notifyUserOfContactEdit(user: User, noticeCopy: string, actionCopy: string): Promise<void> {
  // if in production or test actually throw error for users without phones
  if (!user.phone && (config.NODE_ENV === 'production' || config.NODE_ENV === 'test')) {
    throw new Error(`User ${user.id} does not have phone number registered in Commons.`);
  } else if (!user.phone) {
    return;
  }

  const twilioClient = TwilioClient.get();

  await twilioClient.messages.create({
    from: config.CITYBLOCK_ADMIN,
    to: user.phone,
    body: noticeCopy,
  });

  await twilioClient.messages.create({
    from: config.CITYBLOCK_ADMIN,
    to: user.phone,
    body: actionCopy,
  });
}

export function getNoticeCopy(patient: Patient, type: PatientContactEdit): string {
  let copy = type === 'addPhoneNumber' ? 'A new contact for ' : 'An existing contact for ';

  const patientName = formatAbbreviatedName(
    patient.firstName,
    patient.lastName,
    patient.patientInfo.preferredName,
  );
  copy += `${patientName} has been `;

  const verb = noticeCopyVerbs[type];

  copy += `${verb} Commons.`;

  return copy;
}

export function getActionCopy(patient: Patient, type: PatientContactEdit): string {
  const url = `${config.GOOGLE_OAUTH_REDIRECT_URI}/contacts`;

  if (type === 'addPhoneNumber') {
    return `Please download it here: ${url}`;
  }

  const patientName = formatAbbreviatedName(
    patient.firstName,
    patient.lastName,
    patient.patientInfo.preferredName,
  );

  return `Please delete the ${patientName} contact and download updated contacts here: ${url}`;
}
