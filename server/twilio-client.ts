import config from './config';

/* tslint:disable no-var-requires */
const twilio = require('twilio');
/* tslint:enable no-var-requires */

const twilioClient = new twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);

export default twilioClient;
