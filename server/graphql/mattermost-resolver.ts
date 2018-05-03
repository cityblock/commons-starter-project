import { IMattermostUrlForUserInput, IRootMutationType } from 'schema';
import Mattermost from '../mattermost';
import { checkLoggedInWithPermissions } from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IMattermostUrlForUserCreate {
  input: IMattermostUrlForUserInput;
}

// Note: Not checking permissions as assuming for now any user can message another on Mattermost
/* tslint:disable:check-is-allowed */
export async function mattermostUrlForUserCreate(
  root: {},
  { input }: IMattermostUrlForUserCreate,
  { permissions, userId, logger }: IContext,
): Promise<IRootMutationType['mattermostUrlForUserCreate']> {
  await checkLoggedInWithPermissions(userId, permissions);

  logger.log(`GET Mattermost link to chat what with ${input.email} by ${userId}`, 2);

  const mattermost = Mattermost.get();
  const url = await mattermost.getLinkToMessageUser(input.email);

  return { url };
}
/* tslint:enable:check-is-allowed */
