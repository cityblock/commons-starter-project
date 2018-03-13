/* tslint:disable no-console */
import { transaction } from 'objection';
import Db from '../server/db';
import ComputedPatientStatus from '../server/models/computed-patient-status';
import User from '../server/models/user';

const email = process.env.EMAIL || 'brennan@cityblock.com';

export async function updateAllComputedPatientStatuses() {
  await Db.get();

  await transaction(ComputedPatientStatus.knex(), async txn => {
    const user = await User.getBy({ fieldName: 'email', field: email }, txn);

    if (!user) {
      console.log(`No user found with email: ${email}`);
      await txn.rollback();
      process.exit(1);
    }

    await ComputedPatientStatus.updateForAllPatients(user.id, txn);
  });
}

updateAllComputedPatientStatuses().then(() => {
  console.log('Done.');
  process.exit(0);
});
/* tslint:enable no-console */
