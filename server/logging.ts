import * as Logging from '@google-cloud/logging';
import config from './config';

let singleton: Logger | null = null;

interface IMetadata {
  resource: {
    type: string;
  };
}

interface ILog {
  entry: (metadata: IMetadata, text: string) => any;
  write: (entry: any) => any;
}

export default class Logger {
  static get(): Logger {
    if (singleton) return singleton;
    singleton = new Logger();
    return singleton;
  }

  private metadata: IMetadata = { resource: { type: 'global' } };
  private debugLog: ILog;
  private errorLog: ILog;

  constructor() {
    const credentials = JSON.parse(String(config.GCP_CREDS));
    const logging = new Logging({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      projectId: credentials.project_id,
    });
    this.debugLog = logging.log('debug');
    this.errorLog = logging.log('error');
  }

  log(text: string) {
    const shortenedText = text.substring(0, 110000 / 2); // Each character is 2 bytes, max of 110kb for text in logs
    const entry = this.debugLog.entry(this.metadata, shortenedText);

    return this.debugLog.write(entry).catch((err: string) => {
      console.error('ERROR WRITING LOG:', err);
    });
  }

  error(text: string) {
    const entry = this.errorLog.entry(this.metadata, text);

    return this.errorLog.write(entry).catch((error: string) => {
      console.error('ERROR WRITING ERROR:', error);
    });
  }
}
