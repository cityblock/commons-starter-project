import twilio from 'twilio';
import config from './config';

let singleton: any;

export default class TwilioClient {
  static get() {
    if (singleton) return singleton;
    singleton = new (twilio as any)(
      config.TWILIO_SID || 'test_sid',
      config.TWILIO_AUTH_TOKEN || 'test_auth_token',
    );
    return singleton;
  }
}
