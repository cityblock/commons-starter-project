import * as express from 'express';
import { transaction } from 'objection';
import Db from '../../db';
import User from '../../models/user';

export async function checkPostgresHandler(req: express.Request, res: express.Response) {
  const existingTxn = res.locals.existingTxn;
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
  } catch (err) {
    console.error('PostgreSQL check failed!');
    console.error(err.message);
    console.error('Full error object:');
    console.error(err);
    res.status(500).send(err.message);
  }
}
