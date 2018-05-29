import { addProcessingJobToQueue } from '../helpers/queue-helpers';

const VOICEMAIL_TOPIC = 'processVoicemail';

addProcessingJobToQueue(VOICEMAIL_TOPIC);
