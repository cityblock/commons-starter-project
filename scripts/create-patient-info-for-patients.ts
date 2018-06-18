import Knex from 'knex';
import { transaction, Model } from 'objection';
import Patient from '../server/models/patient';
import User from '../server/models/user';

/* tslint:disable no-var-requires */
const knexConfig = require('../server/models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

const email = process.env.EMAIL || 'cristina@cityblock.com';

export async function createInfo() {
  return transaction(User.knex(), async txn => {
    const user = await User.getBy(
      {
        fieldName: 'email',
        field: email,
      },
      txn,
    );

    if (!user) {
      /* tslint:disable no-console */
      console.log(`No user found with email: ${email}`);
      /* tslint:enable no-console */
      process.exit(1);
      return;
    }

    return Patient.createAllPatientInfo(user.id, txn);
  });
}

createInfo().then(() => {
  process.exit(0);
});
