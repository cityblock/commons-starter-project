import 'fetch-everywhere';
import { stringify } from 'querystring';
import { IPatientSetupInput } from 'schema';
import config from '../../config';
import { formatClinicalSummaryQueryOptions, formatPatientCreateOptions } from './formatters';
import {
  IRedoxClinicalSummaryQueryResponse,
  IRedoxError,
  IRedoxPatientCreateResponse,
} from './types';

let singleton: RedoxApi;

export interface IAuth {
  expires: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * Wrapper around the Redox API.
 *
 * This handles authentication and provides typed API calls.
 */
export default class RedoxApi {
  static async get(): Promise<RedoxApi> {
    if (singleton) return singleton;
    singleton = new RedoxApi();
    return singleton;
  }

  private static async getAuth() {
    const response = await fetch(config.REDOX_TOKEN_URL, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: stringify({
        apiKey: config.REDOX_KEY,
        secret: config.REDOX_SECRET,
      }),
      method: 'POST',
    });
    /* istanbul ignore next */
    if (!response.ok) {
      // TODO: Improve error handling
      console.warn(response.statusText);
      const error = await response.text();
      console.warn(error);
    }
    return (await response.json()) as IAuth;
  }

  auth: IAuth;

  private constructor() {
    this.auth = {
      expires: '2017-06-06T21:13:30.325Z',
      accessToken: 'fake-token',
      refreshToken: 'fake-refresh',
    };
  }

  async patientCreate(patient: IPatientSetupInput & { id: string }) {
    const formattedPatientOptions = formatPatientCreateOptions(patient);
    const result = await this.fetch<IRedoxPatientCreateResponse>(
      config.REDOX_API_URL,
      formattedPatientOptions,
    );
    return result;
  }

  async patientEncountersGet(patientId: string): Promise<IRedoxClinicalSummaryQueryResponse> {
    return this.patientClinicalSummaryGet(patientId);
  }

  async patientMedicationsGet(patientId: string): Promise<IRedoxClinicalSummaryQueryResponse> {
    return this.patientClinicalSummaryGet(patientId);
  }

  async patientClinicalSummaryGet(patientId: string): Promise<IRedoxClinicalSummaryQueryResponse> {
    const formattedClinicalSummaryQueryOptions = formatClinicalSummaryQueryOptions(
      patientId,
      'AthenaNet Enterprise ID',
    );

    const result = await this.fetch<IRedoxClinicalSummaryQueryResponse>(
      config.REDOX_API_URL,
      formattedClinicalSummaryQueryOptions,
    );
    return result;
  }

  /**
   * Supports GET and POST by handling params differently
   */
  private async fetch<T>(endpoint: string, params: any, refreshed: boolean = false): Promise<any> {
    let response;
    let tokenValid = new Date(this.auth.expires) > new Date();

    // Only fetch if we know the token works
    if (tokenValid) {
      response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          Authorization: `Bearer ${this.auth.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // the type T should also have error information
        const errorResponse = (await response.json()) as T;
        const errors = ((errorResponse as any).Meta.Errors || [])
          .map((error: IRedoxError) => error.Text)
          .join(' ');
        throw new Error(`${errors}, ${endpoint}, ${response.status}`);
      }

      // Set the token to invalid if we failed to auth
      if (response.status === 401 && !refreshed) {
        tokenValid = false;
      }
    }

    // Refresh and refetch if token is invalid
    if (!tokenValid) {
      await this.refreshToken();
      return this.fetch<T>(endpoint, params, true);
    } else if (response) {
      return (await response.json()) as T;
    }
  }

  private async refreshToken() {
    this.auth = await RedoxApi.getAuth();
  }
}
