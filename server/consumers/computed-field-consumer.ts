import * as dotenv from 'dotenv';
dotenv.config();

import * as kue from 'kue';
import { transaction, Transaction } from 'objection';
import Db from '../db';
import { IComputedFieldMessageData } from '../handlers/pubsub/push-handler';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import { createSuggestionsForComputedFieldAnswer } from '../lib/suggestions';
import Answer from '../models/answer';
import Patient from '../models/patient';
import PatientAnswer from '../models/patient-answer';

const queue = kue.createQueue({ redis: createRedisClient() });

queue.process('computedField', async (job, done) => {
  try {
    await processNewComputedFieldValue(job.data);
    return done();
  } catch (err) {
    return done(err);
  }
});

queue.on('error', err => {
  reportError(err, 'Kue error');
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

  await Db.get();

  await transaction(existingTxn || PatientAnswer.knex(), async txn => {
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

    const patientAnswer = (await PatientAnswer.create(
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
        type: 'computedFieldAnswer',
      },
      txn,
    ))[0];

    await createSuggestionsForComputedFieldAnswer(
      patientId,
      patientAnswer.id,
      computedField.id,
      txn,
    );
  });
}
