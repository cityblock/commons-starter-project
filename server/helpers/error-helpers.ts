import { ErrorReporting } from '@google-cloud/error-reporting';
import config from '../config';

export const reportError = (error: Error, message: string, payload?: any) => {
  const credentials = JSON.parse(String(config.GCP_CREDS));
  const errorReporting = new ErrorReporting({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    projectId: credentials.project_id,
  });
  const formattedPayload = payload ? `, payload: ${JSON.stringify(payload)}` : '';
  const errorMessage = `${message}. Error: ${error}${formattedPayload}`;
  console.error(errorMessage);
  errorReporting.report(errorMessage);
};
