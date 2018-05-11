/* tslint:disable no-console */
import * as Knex from 'knex';
import { transaction, Model } from 'objection';
import { adminTasksConcernTitle } from '../server/lib/consts';
import Concern from '../server/models/concern';
import Patient from '../server/models/patient';
import PatientConcern from '../server/models/patient-concern';
import User from '../server/models/user';
/* tslint:disable no-var-requires */
const knexConfig = require('../server/models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

const email = process.env.EMAIL || 'brennan@cityblock.com';

export async function createAdminTasksConcernForPatients() {
  const txn = await transaction.start(User.knex());

  const user = await User.getBy(
    {
      fieldName: 'email',
      field: email,
    },
    txn,
  );

  if (!user) {
    console.log(`No user found with email: ${email}`);
    process.exit(1);
  }

  const adminTasksConcern = await Concern.findOrCreateByTitle(adminTasksConcernTitle, txn);
  const skippablePatientIds = PatientConcern.query()
    .select('patientId')
    .where({ concernId: adminTasksConcern.id });
  const patientsMissingConcern = (await Patient.query()
    .select('id')
    .where('id', 'not in', skippablePatientIds)) as any;
  const patientConcernPromises = patientsMissingConcern.map(async (patient: any) =>
    PatientConcern.create(
      {
        concernId: adminTasksConcern.id,
        patientId: patient.id,
        userId: user!.id,
        startedAt: new Date().toISOString(),
      },
      txn,
    ),
  );

  await Promise.all(patientConcernPromises);
  await txn.commit();
}

createAdminTasksConcernForPatients().then(() => {
  console.log('Done.');
  process.exit(0);
});
/* tslint:enable no-console */
