import { ErrorReporting } from '@google-cloud/error-reporting';
import * as express from 'express';
import { transaction } from 'objection';
import config from '../../config';
import Db from '../../db';
import User from '../../models/user';

export async function checkPostgresHandler(req: express.Request, res: express.Response) {
  const existingTxn = res.locals.existingTxn;
  const errorReporting = new ErrorReporting({ credentials: JSON.parse(String(config.GCP_CREDS)) });

  try {
    await Db.get();
    // NOTE: This test succeeds if the email is incorrect
    await transaction(User.knex(), async txn => {
      await User.getBy(
        {
          fieldName: 'email',
          field: 'fake@does-not-exist.com',
        },
        existingTxn || txn,
      );
    });
    res.sendStatus(200);
  } catch (error) {
    errorReporting.report('PostgreSQL check failed!');
    errorReporting.report(error);
    res.status(500).send(error.message);
  }
}
