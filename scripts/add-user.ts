import Db from '../server/db';
import CareTeam from '../server/models/care-team';
import Clinic from '../server/models/clinic';
import Patient from '../server/models/patient';
import User, { UserRole } from '../server/models/user';

const email = process.env.EMAIL || 'brennan@sidewalklabs.com';
const firstName = process.env.FIRST_NAME;
const lastName = process.env.LAST_NAME;
const userRole = (process.env.USER_ROLE || 'physician') as UserRole;
const athenaProviderId = process.env.PROVIDER_ID;

async function createUser() {
  await Db.get();

  const clinics = await Clinic.getAll({ pageNumber: 0, pageSize: 1 });
  const clinic = clinics.results[0];

  if (!clinic) {
    throw new Error('You must create a clinic before creating users.');
  }

  const user = await User.create({
    firstName,
    lastName,
    userRole,
    email,
    homeClinicId: clinic.id,
    athenaProviderId: Number(athenaProviderId),
  });

  const patients = await Patient.getAll({ pageNumber: 0, pageSize: 100 });

  patients.results.forEach(async patient => {
    await CareTeam.create({ userId: user.id, patientId: patient.id });
  });
}

/* tslint:disable no-console */
if (!email || !firstName || !lastName || !athenaProviderId) {
  console.error('You must provide the following: EMAIL, FIRST_NAME, LAST_NAME, and PROVIDER_ID');
} else {
  createUser().then(() => {
    console.log('Done.');
    process.exit(0);
  });
}
/* tslint:enable no-console */
