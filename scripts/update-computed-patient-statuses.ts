/* tslint:disable no-console */
import * as Knex from 'knex';
import { transaction, Model } from 'objection';
import ComputedPatientStatus from '../server/models/computed-patient-status';
import User from '../server/models/user';

/* tslint:disable no-var-requires */
const knexConfig = require('../server/models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

const email = process.env.EMAIL || 'brennan@cityblock.com';

export async function updateAllComputedPatientStatuses() {
  await transaction(ComputedPatientStatus.knex(), async txn => {
    const user = await User.getBy({ fieldName: 'email', field: email }, txn);

    if (!user) {
      console.log(`No user found with email: ${email}`);
      await txn.rollback();
      process.exit(1);
      return;
    }

    await ComputedPatientStatus.updateForAllPatients(user.id, txn);
  });
}

updateAllComputedPatientStatuses().then(() => {
  console.log('Done.');
  process.exit(0);
});
/* tslint:enable no-console */
