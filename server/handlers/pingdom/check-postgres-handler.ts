import { ErrorReporting } from '@google-cloud/error-reporting';
import * as express from 'express';
import { transaction } from 'objection';
import config from '../../config';
import Logging from '../../logging';
import User from '../../models/user';

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

/* tslint:disable no-var-requires */
const knexConfig = require('../../models/knexfile');
/* tslint:enable no-var-requires */

export async function checkPostgresHandler(req: express.Request, res: express.Response) {
  const existingTxn = res.locals.existingTxn;
  const errorReporting = new ErrorReporting({ credentials: JSON.parse(String(config.GCP_CREDS)) });

  try {
    await transaction(User.knex(), async txn => {
      const db = knexConfig[config.NODE_ENV].connection.database;
      const numberConnections = await User.knex().raw(
        `select count (*) from pg_stat_activity where datname = ?`,
        db,
        existingTxn || txn,
      );
      logger.log(`Number of postgres connections: ${numberConnections.rows[0].count}`);
    });
    res.sendStatus(200);
  } catch (error) {
    errorReporting.report('PostgreSQL check failed!');
    errorReporting.report(error);
    res.status(500).send(error.message);
  }
}
