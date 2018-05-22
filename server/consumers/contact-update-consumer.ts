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

type PatientContactEdit =
  | 'addPhoneNumber'
  | 'editPhoneNumber'
  | 'deletePhoneNumber'
  | 'addCareTeamMember'
  | 'editPreferredName';

interface IProcessPatientContactEditData {
  type: PatientContactEdit;
  patientId?: string; // include this if single patient
  patientIds?: string[]; // include this is multiple patients (bulk assign)
  userId?: string; // notify a specific user vs entire care team
  prevPreferredName?: string; // so user knows which contact to delete if preferred name change
}

type NoticeCopyVerbs = { [K in PatientContactEdit]: string };

const noticeCopyVerbs: Partial<NoticeCopyVerbs> = {
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
  if (data.patientId) {
    await processSinglePatientContactEdit(data, existingTxn);
  } else if (data.patientIds && data.userId) {
    await processBulkPatientContactEdit(data, existingTxn);
  }
}

async function processSinglePatientContactEdit(
  data: IProcessPatientContactEditData,
  existingTxn?: Transaction,
): Promise<void> {
  await transaction(existingTxn || Patient.knex(), async txn => {
    const patient = await Patient.get(data.patientId!, txn);
    const noticeCopy = getNoticeCopy(patient, data.type, data.prevPreferredName);
    const actionCopy = getActionCopy(patient, data.type, data.prevPreferredName);

    // if no user specified, update care team
    if (!data.userId) {
      const careTeam = await CareTeam.getForPatient(data.patientId!, txn);
      careTeam.forEach(async user => {
        await notifyUserOfContactEdit(user, noticeCopy, actionCopy);
      });
      // if new patient has at least one phone, notify user of new contact
    } else if (patient.patientInfo.primaryPhone) {
      const user = await User.get(data.userId, txn);
      await notifyUserOfContactEdit(user, noticeCopy, actionCopy);
    }
  });
}

async function processBulkPatientContactEdit(
  data: IProcessPatientContactEditData,
  existingTxn?: Transaction,
): Promise<void> {
  await transaction(existingTxn || Patient.knex(), async txn => {
    for (const patientId of data.patientIds!) {
      const patient = await Patient.get(patientId, txn);

      if (patient.patientInfo.primaryPhone) {
        const user = await User.get(data.userId!, txn);
        const noticeCopy = getNoticeCopy(patient, data.type);
        const actionCopy = getActionCopy(patient, data.type);

        await notifyUserOfContactEdit(user, noticeCopy, actionCopy);
        // break loop, since don't want to notify user multiple times
        break;
      }
    }
  });
}

export async function notifyUserOfContactEdit(
  user: User,
  noticeCopy: string,
  actionCopy: string | null,
): Promise<void> {
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

  if (actionCopy) {
    await twilioClient.messages.create({
      from: config.CITYBLOCK_ADMIN,
      to: user.phone,
      body: actionCopy,
    });
  }
}

export function getNoticeCopy(
  patient: Patient,
  type: PatientContactEdit,
  prevPreferredName?: string | null,
): string {
  // if add to care team message, short enough for 1 SMS
  if (type === 'addCareTeamMember') {
    const url = `${config.GOOGLE_OAUTH_REDIRECT_URI}/contacts`;
    return `A member has been added to your care team. Please download updated contacts here: ${url}`;
  }

  const patientName = formatAbbreviatedName(
    patient.firstName,
    patient.lastName,
    prevPreferredName || patient.patientInfo.preferredName,
  );

  if (type === 'editPreferredName') {
    return `The preferred name of ${patientName} has been updated in Commons.`;
  }

  let copy = type === 'addPhoneNumber' ? 'A new contact for ' : 'An existing contact for ';

  copy += `${patientName} has been `;

  const verb = noticeCopyVerbs[type];

  copy += `${verb} Commons.`;

  return copy;
}

export function getActionCopy(
  patient: Patient,
  type: PatientContactEdit,
  prevPreferredName?: string | null,
): string | null {
  if (type === 'addCareTeamMember') return null;

  const url = `${config.GOOGLE_OAUTH_REDIRECT_URI}/contacts`;

  if (type === 'addPhoneNumber') {
    return `Please download it here: ${url}`;
  }

  const patientName = formatAbbreviatedName(
    patient.firstName,
    patient.lastName,
    prevPreferredName || patient.patientInfo.preferredName,
  );

  return `Please delete the ${patientName} contact and download updated contacts here: ${url}`;
}
