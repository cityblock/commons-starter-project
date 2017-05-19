import { convertUser } from '../graphql/shared/converter';
import CareTeam from '../models/care-team';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

interface IQuery {
  patientId: string;
}

interface ICareTeamOptions {
  input: {
    userId: string;
    patientId: string;
  };
}

export async function addUserToCareTeam(
  source: any, { input }: ICareTeamOptions, context: IContext,
) {
  const { userRole } = context;
  const { userId, patientId } = input;
  await accessControls.isAllowed(userRole, 'edit', 'patient');

  return await CareTeam.addUserToCareTeam({ userId, patientId });
}

export async function removeUserFromCareTeam(
  source: any, { input }: ICareTeamOptions, context: IContext,
) {
  const { userRole } = context;
  const { userId, patientId } = input;
  await accessControls.isAllowed(userRole, 'edit', 'patient');

  return await CareTeam.removeUserFromCareTeam({ userId, patientId });
}

export async function resolvePatientCareTeam(
  root: any,
  { patientId }: IQuery,
  { userRole, userId }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const users = await CareTeam.getForPatient(patientId);
  return users.map(convertUser);
}
