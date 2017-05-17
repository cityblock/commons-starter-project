import * as express from 'express';
import Db from '../../db';
import User from '../../models/user';

export async function checkPostgresHandler(req: express.Request, res: express.Response) {
  try {
    await Db.get();
    // NOTE: This test succeeds if the email is incorrect
    await User.getBy('email', 'fake@does-not-exist.com');
    res.sendStatus(200);
  } catch (err) {
    console.error('PostgreSQL check failed!');
    console.error(err.message);
    console.error('Full error object:');
    console.error(err);
    res.status(500).send(err.message);
  }
}
