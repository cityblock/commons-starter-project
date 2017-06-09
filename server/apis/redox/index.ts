import 'fetch-everywhere';
import { stringify } from 'querystring';
import config from '../../config';

let singleton: RedoxApi;

interface IAuth {
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
    if (!response.ok) {
      // TODO: Improve error handling
      console.warn(response.statusText);
      const error = await response.text();
      console.warn(error);
    }
    return await response.json() as IAuth;
  }

  auth: IAuth;

  private constructor() {
    this.auth = {
      expires: '2017-06-06T21:13:30.325Z',
      accessToken: 'fake-token',
      refreshToken: 'fake-refresh',
    };
  }

  /**
   * Supports GET and POST by handling params differently
   */
  private async fetch<T>(
    endpoint: string,
    params: { [key: string]: string | number } = {},
    refreshed: boolean = false,
  ): Promise<any> {
    let response;
    let tokenValid = new Date(this.auth.expires) > new Date();
    const url = `${config.Redox_API_BASE}${endpoint}`;

    // Only fetch if we know the token works
    if (tokenValid) {
      response = await fetch(url, {
        method: 'POST',
        body: params,
        headers: {
          'Authorization': `Bearer ${this.auth.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        // TODO: Handle error
        throw new Error(`${errorResponse.error}, ${endpoint}, ${response.status}`);
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
      return await response.json() as T;
    }
  }

  private async refreshToken() {
    this.auth = await RedoxApi.getAuth();
  }
}
