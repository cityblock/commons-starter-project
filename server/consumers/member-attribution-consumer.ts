import dotenv from 'dotenv';
dotenv.config();
import Knex from 'knex';
import kue from 'kue';
import { toNumber } from 'lodash';
import { transaction, Model, Transaction } from 'objection';
import { Gender } from 'schema';
import config from '../config';
import { IMemberAttributionMessageData } from '../handlers/pubsub/push-handler';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import Mattermost from '../mattermost';
import Clinic from '../models/clinic';
import knexConfig from '../models/knexfile';
import Patient from '../models/patient';

const queue = kue.createQueue({ redis: createRedisClient() });

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

queue.process('memberAttribution', async (job, done) => {
  try {
    await processNewMemberAttributionMessage(job.data);
    return done();
  } catch (err) {
    return done(err);
  }
});

queue.on('error', err => {
  reportError(err, 'Kue uncaught error');
});

export async function processNewMemberAttributionMessage(
  data: IMemberAttributionMessageData,
  existingTxn?: Transaction,
) {
  // Note: existingTxn is only for use in tests
  const {
    patientId,
    cityblockId,
    gender,
    firstName,
    middleName,
    lastName,
    ssn,
    dob,
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
    email,
    phone,
    language,
    nmi,
    externalIds,
    productDescription,
    lineOfBusiness,
    medicaidPremiumGroup,
    pcpName,
    pcpPractice,
    pcpPhone,
    pcpAddress,
    memberId,
    insurance,
    inNetwork,
  } = data;

  if (!patientId || !cityblockId || !firstName || !lastName || !dob) {
    return Promise.reject('Missing either patientId, cityblockId, firstName, lastName, or dob');
  }

  await transaction(existingTxn || Patient.knex(), async txn => {
    const patient = await Patient.getById(patientId, txn);
    const homeClinic = await Clinic.findOrCreateAttributionClinic(txn);
    const ssnEnd = ssn.slice(5, 9);
    const mrn =
      externalIds && externalIds.acpny && externalIds.acpny.length
        ? externalIds.acpny[0].externalId
        : null;

    // If a patient exists, update it
    if (patient) {
      return Patient.updateFromAttribution(
        {
          patientId,
          firstName,
          middleName,
          lastName,
          dateOfBirth: dob,
          ssn,
          ssnEnd,
          nmi,
          mrn,
          productDescription,
          lineOfBusiness,
          medicaidPremiumGroup,
          pcpName,
          pcpPractice,
          pcpPhone,
          pcpAddress,
          memberId,
          insurance,
          inNetwork,
        },
        txn,
      );
      // else, create a new one
    } else {
      let formattedGender: Gender | null = null;

      if (gender === 'M') {
        formattedGender = 'male' as Gender;
      } else if (gender === 'F') {
        formattedGender = 'female' as Gender;
      }

      const newPatient = await Patient.create(
        {
          patientId,
          cityblockId: toNumber(cityblockId), // Everything is a string in Redis land
          firstName,
          middleName,
          lastName,
          homeClinicId: homeClinic.id,
          dateOfBirth: dob,
          ssn,
          ssnEnd,
          gender: formattedGender,
          language,
          addressLine1,
          addressLine2,
          city,
          state,
          zip,
          email,
          phone,
          nmi,
          mrn,
          productDescription,
          lineOfBusiness,
          medicaidPremiumGroup,
          pcpName,
          pcpPractice,
          pcpPhone,
          pcpAddress,
          memberId,
          insurance,
          inNetwork,
        },
        txn,
      );
      // and create associated patient channel in mattermost
      const mattermost = Mattermost.get();
      return mattermost.createChannelForPatient(newPatient);
    }
  });
}
