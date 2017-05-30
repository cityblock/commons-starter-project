import 'fetch-everywhere';
import { decode } from 'jsonwebtoken';
import { stringify } from 'qs';
import config from '../../config';

interface IAuthToken {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  id_token: string;
}

export interface IGoogleProfile {
  azp: string;
  aud: string;
  sub: string;
  hd: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  iss: string;
  iat: number;
  exp: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
}

export async function OauthAuthorize(code: string): Promise<IAuthToken> {
  const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: stringify({
      client_id: config.GOOGLE_OAUTH_TOKEN,
      client_secret: config.GOOGLE_OAUTH_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: config.GOOGLE_OAUTH_REDIRECT_URI,
      code,
    }),
  });
  return await response.json() as IAuthToken;
}

export function parseIdToken(idToken: string): IGoogleProfile {
  const result = decode(idToken) as IGoogleProfile;
  if (!result || !result.email_verified) {
    throw new Error('Auth failed: Email not verified');
  }
  return result;
}
