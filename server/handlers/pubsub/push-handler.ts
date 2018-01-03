import * as express from 'express';
import { transaction } from 'objection';
import Db from '../../db';
import { createSuggestionsForComputedFieldAnswer } from '../../lib/suggestions';
import Answer from '../../models/answer';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';

export interface IPubsubMessageData {
  patientId?: string;
  slug?: string;
  value?: string | number | boolean;
  jobId?: string;
}

/* tslint:disable no-console */
export async function pubsubPushHandler(req: express.Request, res: express.Response) {
  const { patientId, slug, value, jobId } = req.body.message.data;

  if (!patientId || !slug || !value || !jobId) {
    console.error('Must provide a patientId, slug, value, and jobId');
    res.sendStatus(200);
    return;
  }

  await Db.get();

  try {
    await Patient.get(patientId);
  } catch (err) {
    console.error(`Cannot find patient for id: ${patientId}`);
    res.sendStatus(200);
    return;
  }

  const answer = await Answer.getByComputedFieldSlugAndValue({ slug, value });

  if (!answer) {
    console.error(`Cannot find answer for slug: ${slug} and value: ${value}`);
    res.sendStatus(200);
    return;
  }

  const { computedField } = answer.question;

  try {
    await transaction(PatientAnswer.knex(), async txn => {
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
  } catch (err) {
    console.error('Problem recording answer');
    res.sendStatus(200);
    return;
  }

  res.sendStatus(200);
}
/* tslint:enable no-console */
