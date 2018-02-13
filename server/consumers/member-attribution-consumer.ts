import * as kue from 'kue';
import { pickBy, toNumber } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../db';
import { IMemberAttributionMessageData } from '../handlers/pubsub/push-handler';
import { createRedisClient } from '../lib/redis';
import Patient, { IPatientCreateFields, IPatientUpdateFields } from '../models/patient';
import PatientAnswer from '../models/patient-answer';

const queue = kue.createQueue({ redis: createRedisClient() });

queue.process('memberAttribution', async (job, done) => {
  try {
    await processNewMemberAttributionMessage(job.data);
    return done();
  } catch (err) {
    return done(err);
  }
});

/* tslint:disable:no-console */
queue.on('error', err => {
  console.log(`Kue error: ${err}`);
});
/* tslint:enable:no-console */

export async function processNewMemberAttributionMessage(
  data: IMemberAttributionMessageData,
  existingTxn?: Transaction,
) {
  // Note: existingTxn is only for use in tests
  const { patientId, homeClinicId, cityblockId, firstName, lastName, dateOfBirth, jobId } = data;

  // TODO: Make this less strict
  if (
    !patientId ||
    !homeClinicId ||
    !cityblockId ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !jobId
  ) {
    return Promise.reject(
      'Missing either patientId, homeClinicId, cityblockId, firstName, lastName, dateOfBirth, or jobId',
    );
  }

  await Db.get();

  await transaction(existingTxn || PatientAnswer.knex(), async txn => {
    const patient = await Patient.getById(patientId, txn);

    // If a patient exists, update it
    if (patient) {
      const dataForUpdate = pickBy<IPatientUpdateFields>(data);
      await Patient.updateFromAttribution(
        {
          ...dataForUpdate,
          patientId,
          cityblockId: toNumber(cityblockId), // Everything is a string in Redis land
        },
        txn,
      );
      // else, create a new one
    } else {
      const dataForCreate = pickBy<IPatientCreateFields>(data);
      await Patient.create(
        {
          ...dataForCreate,
          patientId,
          cityblockId: toNumber(cityblockId), // Everything is a string in Redis land
        } as any, // TODO: Fix type
        txn,
      );
    }
  });
}