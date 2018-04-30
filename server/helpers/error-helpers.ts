import { ErrorReporting } from '@google-cloud/error-reporting';
import config from '../config';

export const reportError = (error: Error, message: string, payload?: any) => {
  const errorReporting = new ErrorReporting({ credentials: JSON.parse(String(config.GCP_CREDS)) });
  const formattedPayload = payload ? `, payload: ${JSON.stringify(payload)}` : '';

  errorReporting.report(`${message}. Error: ${error}${formattedPayload}`);
};