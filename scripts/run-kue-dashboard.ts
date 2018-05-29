/* tslint:disable no-console */
import * as dotenv from 'dotenv';
dotenv.config();

import * as kue from 'kue';
import { createRedisClient } from '../server/lib/redis';

kue.createQueue({
  redis: createRedisClient(),
});

kue.app.listen(8080);
console.log('Running Kue dashboard on localhost:8080');
/* tslint:enable no-console */
