/* tslint:disable no-console */
import Db from '../server/db';
import { adminTasksConcernTitle } from '../server/lib/consts';
import Concern from '../server/models/concern';
import Patient from '../server/models/patient';
import PatientConcern from '../server/models/patient-concern';
import User from '../server/models/user';

const email = process.env.EMAIL || 'brennan@cityblock.com';

export async function createAdminTasksConcernForPatients() {
  await Db.get();

  const user = await User.getBy({
    fieldName: 'email',
    field: email,
  });

  if (!user) {
    console.log(`No user found with email: ${email}`);
    process.exit(1);
  }

  const adminTasksConcern = await Concern.findOrCreateByTitle(adminTasksConcernTitle);
  const skippablePatientIds = PatientConcern.query()
    .select('patientId')
    .where({ concernId: adminTasksConcern.id });
  const patientsMissingConcern = (await Patient.query()
    .select('id')
    .where('id', 'not in', skippablePatientIds)) as any;
  const patientConcernPromises = patientsMissingConcern.map(async (patient: any) =>
    PatientConcern.create({
      concernId: adminTasksConcern.id,
      patientId: patient.id,
      userId: user!.id,
      startedAt: new Date().toISOString(),
    }),
  );

  await Promise.all(patientConcernPromises);
}

createAdminTasksConcernForPatients().then(() => {
  console.log('Done.');
  process.exit(0);
});
/* tslint:enable no-console */
