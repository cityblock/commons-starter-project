import { addProcessingJobToQueue } from '../helpers/queue-helpers';

const SMS_MESSAGE_TOPIC = 'processSmsMessage';

addProcessingJobToQueue(SMS_MESSAGE_TOPIC);
