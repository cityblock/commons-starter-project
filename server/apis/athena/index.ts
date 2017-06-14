import * as Base64 from 'base-64';
import 'fetch-everywhere';
import { isNil, omitBy } from 'lodash';
import { stringify } from 'querystring';
import config from '../../config';
import { AthenaResponseError } from '../../lib/errors';
import { formatEditPatientHealthRecordOptions } from './formatters';
import {
  IAddNoteToAppointmentResponse,
  IAthenaPatientEditableFields,
  IBookAppointmentErrorResponse,
  IBookAppointmentResponse,
  ICheckinAppointmentResponse,
  ICheckoutAppointmentResponse,
  IOpenAppointmentResponse,
  IPatientEditableFields,
  IPatientInfoAthena,
  IPatientMedicationsResponse,
  ITokenResponse,
} from './types';

let singleton: AthenaApi;

interface IAuth {
  expiresAtMillis: number;
  accessToken: string;
}

export interface IPatientResponse {
  athenaPatientId: number;
}

export type IAthenaCreatePatient =
  Pick<IPatientEditableFields, 'firstName'> &
  Pick<IPatientEditableFields, 'lastName'> &
  Pick<IPatientEditableFields, 'gender'> &
  Pick<IPatientEditableFields, 'zip'> &
  Pick<IPatientEditableFields, 'dateOfBirth'> &
  Pick<IPatientEditableFields, 'departmentId'> &
  Partial<IPatientEditableFields>;

export type IAthenaEditPatient = Partial<IPatientEditableFields>;

/**
 * Wrapper around the Athena API.
 *
 * This handles authentication and provides typed API calls.
 */
export default class AthenaApi {

  static async get(): Promise<AthenaApi> {
    if (singleton) return singleton;
    singleton = new AthenaApi();
    return singleton;
  }

  private static async getAuth() {
    const auth64 = Base64.encode(`${config.ATHENA_CLIENT_KEY}:${config.ATHENA_CLIENT_SECRET}`);
    const response = await fetch(config.ATHENA_TOKEN_URL, {
      headers: {
        'Authorization': `Basic ${auth64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      method: 'POST',
    });
    if (!response.ok) {
      console.warn(response.statusText);
      // This fails because Athena claims its error responses are gzipped when they are not.
      // const error = await response.text();
      // console.warn(error);
      throw new Error('Auth failed!');
    }
    const json = await response.json() as ITokenResponse;
    const athenaExpiresInMilli = json.expires_in * 1000;
    return {
      expiresAtMillis: Date.now() + athenaExpiresInMilli,
      accessToken: json.access_token,
    };
  }

  auth: IAuth;

  private constructor() {
    this.auth = {
      expiresAtMillis: -1,
      accessToken: 'fake-token',
    };
  }

  public async getPatient(athenaPatientId: number): Promise<IPatientInfoAthena> {
    return await this.fetch<IPatientInfoAthena>(
      `/${config.ATHENA_PRACTICE_ID}/patients/${athenaPatientId}`,
    );
  }

  /**
   * creates a patient in athena
   * Note: this endpoint is extremely slow on the athena side
   */
  public async patientCreate(
    options: IAthenaCreatePatient,
  ): Promise<IPatientResponse> {
    const formattedPatientOptions = formatEditPatientHealthRecordOptions(options);

    const filtered = omitBy<{}, Partial<IAthenaPatientEditableFields>>(
      formattedPatientOptions, isNil,
    );
    // Add department ID back
    (filtered as any).departmentId = options.departmentId;
    const response = await this.fetch(
      `/${config.ATHENA_PRACTICE_ID}/patients`, filtered, 'POST',
    );
    return {
      athenaPatientId: Number(response[0].patientid),
    };
  }

  public async patientEdit(
    options: IAthenaEditPatient, athenaPatientId: number,
  ): Promise<IPatientResponse> {
    const formattedPatientOptions = formatEditPatientHealthRecordOptions(options);
    const filtered = omitBy<{}, Partial<IAthenaPatientEditableFields>>(
      formattedPatientOptions, isNil,
    );
    const response = await this.fetch(
      `/${config.ATHENA_PRACTICE_ID}/patients/${athenaPatientId}`, filtered, 'PUT',
    );
    return {
      athenaPatientId: Number(response[0].patientid),
    };
  }

  public async patientMedicationsGet(
    athenaPatientId: number,
    athenaDepartmentId: number,
  ): Promise<IPatientMedicationsResponse> {
    return await this.fetch<IPatientMedicationsResponse>(
      `/${config.ATHENA_PRACTICE_ID}/chart/${athenaPatientId}/medications`, {
        departmentid: athenaDepartmentId,
      });
  }

  public async appointmentsGetOpen(
    athenaDepartmentId: number,
    athenaAppointmentTypeId: number,
    athenaProviderId: number,
    appointmentTime: string,
    appointmentDate: string,
  ): Promise<IOpenAppointmentResponse> {
    return await this.fetch<IOpenAppointmentResponse>(
      `/${config.ATHENA_PRACTICE_ID}/appointments/open`, {
        departmentid: athenaDepartmentId,
        appointmenttypeid: athenaAppointmentTypeId,
        providerid: athenaProviderId,
        appointmenttime: appointmentTime,
        appointmentdate: appointmentDate,
      }, 'POST');
  }

  public async appointmentBook(
    athenaAppointmentId: string,
    athenaPatientId: number,
    athenaAppointmentTypeId: number,
  ): Promise<IBookAppointmentResponse[] | IBookAppointmentErrorResponse> {
    return await this.fetch<IBookAppointmentResponse[] | IBookAppointmentErrorResponse>(
      `/${config.ATHENA_PRACTICE_ID}/appointments/${athenaAppointmentId}`, {
        appointmenttypeid: athenaAppointmentTypeId,
        ignoreschedulablepermission: 'true',
        patientid: athenaPatientId,
      }, 'PUT');
  }

  public async appointmentCheckin(
    athenaAppointmentId: string,
  ): Promise<ICheckinAppointmentResponse> {
    return await this.fetch<ICheckinAppointmentResponse>(
      `/${config.ATHENA_PRACTICE_ID}/appointments/${athenaAppointmentId}/checkin`, {}, 'POST');
  }

  public async appointmentCheckout(
    athenaAppointmentId: string,
  ): Promise<ICheckoutAppointmentResponse> {
    return await this.fetch<ICheckoutAppointmentResponse>(
      `/${config.ATHENA_PRACTICE_ID}/appointments/${athenaAppointmentId}/checkout`, {}, 'POST');
  }

  public async appointmentAddNote(
    athenaAppointmentId: string,
    noteText: string,
  ): Promise<IAddNoteToAppointmentResponse> {
    // Optionally, we can also pass in the displayonschedule=true param
    return await this.fetch<IAddNoteToAppointmentResponse>(
      `/${config.ATHENA_PRACTICE_ID}/appointments/${athenaAppointmentId}/notes`, {
        notetext: noteText,
      }, 'POST');
  }

  /**
   * Supports GET and POST by handling params differently
   */
  private async fetch<T>(
    endpoint: string,
    params: { [key: string]: string | number } = {},
    method = 'GET',
    refreshed: boolean = false,
  ): Promise<any> {
    let response;
    const tenSeconds = 6000;
    let tokenValid = (this.auth.expiresAtMillis - tenSeconds) > Date.now();

    // handle adding params to search for GET and to body for POST
    let body = null;
    let search = null;
    let url = null;
    if (method === 'GET') {
      search = stringify(params);
      if (search) search = '?' + search;
      url = `${config.ATHENA_API_BASE}${endpoint}${search}`;
    } else {
      url = `${config.ATHENA_API_BASE}${endpoint}`;
      // athena POST body needs to be url/form encoded. does not accept json.
      body = stringify(params);
    }

    // Only fetch if we know the token works
    if (tokenValid) {
      /* Added 'as any' to the RequestInit object to override isomorphic-fetch's typing. We need
       * to pass in 'compress: false' to get around Athena's incorreclty-specified gzipping
       */
      response = await fetch(url, {
        method,
        body,
        headers: {
          'Authorization': `Bearer ${this.auth.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        compress: false,
      } as any);

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new AthenaResponseError(errorResponse.error, endpoint, response.status);
      }

      // Set the token to invalid if we failed to auth
      if (response.status === 401 && !refreshed) {
        tokenValid = false;
      }
    }

    // Refresh and refetch if token is invalid
    if (!tokenValid) {
      await this.refreshToken();
      return this.fetch<T>(endpoint, params, method, true);
    } else if (response) {
      return await response.json() as T;
    }
  }

  private async refreshToken() {
    this.auth = await AthenaApi.getAuth();
  }
}
