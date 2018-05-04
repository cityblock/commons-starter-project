import {
  IMattermostUrlForPatientInput,
  IMattermostUrlForUserInput,
  IRootMutationType,
} from 'schema';
import Mattermost from '../mattermost';
import checkUserPermissions, { checkLoggedInWithPermissions } from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IMattermostUrlForUserCreate {
  input: IMattermostUrlForUserInput;
}

export interface IMattermostUrlForPatientCreate {
  input: IMattermostUrlForPatientInput;
}

// Note: Not checking permissions as assuming for now any user can message another on Mattermost
/* tslint:disable:check-is-allowed */
export async function mattermostUrlForUserCreate(
  root: {},
  { input }: IMattermostUrlForUserCreate,
  { permissions, userId, logger }: IContext,
): Promise<IRootMutationType['mattermostUrlForUserCreate']> {
  await checkLoggedInWithPermissions(userId, permissions);

  logger.log(`GET Mattermost link to chat what with ${input.email} by ${userId}`);

  const mattermost = Mattermost.get();
  const url = await mattermost.getLinkToMessageUser(input.email);

  return { url };
}
/* tslint:enable:check-is-allowed */

export async function mattermostUrlForPatientCreate(
  root: {},
  { input }: IMattermostUrlForPatientCreate,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['mattermostUrlForPatientCreate']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, input.patientId);

  logger.log(
    `GET Mattermost link to chat with care team for patient ${input.patientId} by ${userId}`,
  );

  const mattermost = Mattermost.get();
  const url = await mattermost.getLinkToMessageCareTeam(input.patientId, txn);

  return { url };
}
