import { addProcessingJobToQueue } from '../helpers/queue-helpers';

const SMS_MESSAGE_TOPIC = 'processSmsMessages';

addProcessingJobToQueue(SMS_MESSAGE_TOPIC);
