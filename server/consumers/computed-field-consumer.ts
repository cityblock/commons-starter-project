import dotenv from 'dotenv';
dotenv.config();
import Knex from 'knex';
import kue from 'kue';
import { transaction, Model, Transaction } from 'objection';
import config from '../config';
import { IComputedFieldMessageData } from '../handlers/pubsub/push-handler';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import { createSuggestionsForComputedFieldAnswer } from '../lib/suggestions';
import Answer from '../models/answer';
import knexConfig from '../models/knexfile';
import Patient from '../models/patient';
import PatientAnswer from '../models/patient-answer';

const queue = kue.createQueue({ redis: createRedisClient() });

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

queue.process('computedField', async (job, done) => {
  try {
    await processNewComputedFieldValue(job.data);
    return done();
  } catch (err) {
    return done(err);
  }
});

queue.on('error', err => {
  reportError(err, 'Kue uncaught error');
});

export async function processNewComputedFieldValue(
  data: IComputedFieldMessageData,
  existingTxn?: Transaction,
) {
  // Note: existingTxn is only for use in tests
  const { patientId, slug, value, jobId } = data;

  if (!patientId || !slug || !value || !jobId) {
    return Promise.reject('Missing either patientId, slug, value, or jobId');
  }

  return transaction(existingTxn || PatientAnswer.knex(), async txn => {
    try {
      await Patient.get(patientId, txn);
    } catch (err) {
      return Promise.reject(`Cannot find patient for id: ${patientId}`);
    }

    const answer = await Answer.getByComputedFieldSlugAndValue(
      {
        slug,
        value,
      },
      txn,
    );

    if (!answer) {
      return Promise.reject(`Cannot find answer for slug: ${slug} and value: ${value}`);
    }

    const { computedField } = answer.question;

    const patientAnswer = (await PatientAnswer.createForComputedField(
      {
        patientId,
        questionIds: [answer.questionId],
        mixerJobId: jobId,
        answers: [
          {
            answerId: answer.id,
            questionId: answer.questionId,
            answerValue: answer.value,
            patientId,
            applicable: true, // TODO: figure this out
            mixerJobId: jobId,
          },
        ],
      },
      txn,
    ))[0];

    return createSuggestionsForComputedFieldAnswer(
      patientId,
      patientAnswer.id,
      computedField.id,
      txn,
    );
  });
}
