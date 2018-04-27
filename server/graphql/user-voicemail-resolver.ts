import { IRootMutationType, IUserVoicemailSignedUrlCreateInput } from 'schema';
import { loadUserVoicemailUrl } from './shared/gcs/helpers';
import { checkLoggedInWithPermissions } from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IUserVoicemailSignedUrlCreateOptions {
  input: IUserVoicemailSignedUrlCreateInput;
}

// Note: Not checking permissions as can only generate routes for current user's folder
/* tslint:disable:check-is-allowed */
export async function userVoicemailSignedUrlCreate(
  root: {},
  { input }: IUserVoicemailSignedUrlCreateOptions,
  { permissions, userId, testConfig, txn, logger }: IContext,
): Promise<IRootMutationType['userVoicemailSignedUrlCreate']> {
  await checkLoggedInWithPermissions(userId, permissions);
  const { voicemailId } = input;

  if (!voicemailId) {
    throw new Error('Must provide voicemail id');
  }

  logger.log(`GET voicemail ${voicemailId} by ${userId}`, 2);

  const signedUrl = await loadUserVoicemailUrl(userId!, voicemailId, 'read', testConfig);

  if (!signedUrl) {
    throw new Error('Something went wrong, please try again.');
  }

  return { signedUrl };
}
/* tslint:enable:check-is-allowed */
