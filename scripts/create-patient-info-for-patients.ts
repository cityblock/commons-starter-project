import { transaction } from 'objection';
import Db from '../server/db';
import Patient from '../server/models/patient';
import User from '../server/models/user';

const email = process.env.EMAIL || 'cristina@cityblock.com';

export async function createInfo() {
  await Db.get();

  await transaction(Patient.knex(), async txn => {
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

    await Patient.createAllPatientInfo(user.id, txn);
  });
}

createInfo().then(() => {
  process.exit(0);
});
/* tslint:enable no-console */
