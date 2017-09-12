import Db from '../server/db';
import User from '../server/models/user';

const email = process.env.EMAIL;

async function deleteUser() {
  await Db.get();

  const user = await User.getBy('email', email);

  if (user) {
    await User.delete(user.id);
  }
}

/* tslint:disable no-console */
if (!email) {
  console.error('You must provide an EMAIL');
} else {
  deleteUser().then(() => {
    console.log('Done.');
    process.exit(0);
  });
}
/* tslint:enable no-console */
