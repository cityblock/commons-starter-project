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
import PatientPhone from '../models/patient-phone';
import { getActionCopy, notifyUserOfContactEdit } from './contact-update-consumer';

/* tslint:disable no-var-requires */
const knexConfig = require('../models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

interface IPreviousContactData {
  userId: string;
  contactNumber: string;
}

const queue = kue.createQueue({ redis: createRedisClient() });

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

queue.process('checkPreviousContact', async (job, done) => {
  try {
    logger.log('[Consumer][checkPreviousContact] Started processing');
    await processPreviousContactCheck(job.data);
    logger.log('[Consumer][checkPreviousContact] Completed processing');

    return done();
  } catch (err) {
    logger.log('[Consumer][checkPreviousContact] Error processing');
    reportError(err, 'Kue error checkPreviousContact');

    return done(err);
  }
});

queue.on('error', err => {
  reportError(err, 'Kue uncaught error');
});

export async function processPreviousContactCheck(
  data: IPreviousContactData,
  existingTxn?: Transaction,
): Promise<void> {
  await transaction(existingTxn || Patient.knex(), async txn => {
    const patientId = await PatientPhone.getPatientIdForPhoneNumber(data.contactNumber, txn, true);

    // do nothing if phone number not associated with patient
    if (!patientId) {
      return;
    }

    const careTeam = await CareTeam.getForPatient(patientId, txn);
    const user = careTeam.find(member => member.id === data.userId);

    // do nothing if user not on patient's care team
    if (!user) {
      return;
    }

    const patient = await Patient.get(patientId, txn);

    const noticeCopy = getNoticeCopy(patient, data.contactNumber);
    const actionCopy = getActionCopy(patient, 'deletePhoneNumber');

    await notifyUserOfContactEdit(user, noticeCopy, actionCopy);
  });
}

export function getNoticeCopy(patient: Patient, contactNumber: string): string {
  const patientName = formatAbbreviatedName(
    patient.firstName,
    patient.lastName,
    patient.patientInfo.preferredName,
  );

  return `The number ${contactNumber} is no longer associated with member ${patientName}`;
}