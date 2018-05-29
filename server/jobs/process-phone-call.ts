import { addProcessingJobToQueue } from '../helpers/queue-helpers';

const PHONE_CALL_TOPIC = 'processPhoneCall';

addProcessingJobToQueue(PHONE_CALL_TOPIC);
