import { ICareTeamInput, IPatientEdges, IPatientNode, IUser } from 'schema';
import { IPaginatedResults, IPaginationOptions } from '../db';
import { convertUser } from '../graphql/shared/converter';
import CareTeam from '../models/care-team';
import Patient from '../models/patient';
import User from '../models/user';
import accessControls from './shared/access-controls';
import { formatRelayEdge, IContext } from './shared/utils';

export interface IQuery {
  patientId: string;
}

export interface ICareTeamOptions {
  input: ICareTeamInput;
}

export interface IUserPatientPanelOptions extends IPaginationOptions {
  userId: string;
}

export async function careTeamAddUser(
  source: any, { input }: ICareTeamOptions, context: IContext,
): Promise<User[]> {
  const { userRole } = context;
  const { userId, patientId } = input;
  await accessControls.isAllowed(userRole, 'edit', 'patient');

  return await CareTeam.addUserToCareTeam({ userId, patientId });
}

export async function careTeamRemoveUser(
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
): Promise<IUser[]> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const users = await CareTeam.getForPatient(patientId);
  return users.map(convertUser);
}

export async function resolveUserPatientPanel(
  root: any,
  { userId, pageNumber, pageSize }: IUserPatientPanelOptions,
  { userRole, userId: currentUserId }: IContext,
): Promise<IPatientEdges> {
  let patients: IPaginatedResults<Patient>;

  if (userId) {
    // If a userId was passed in, fetch patient panel for that user
    await accessControls.isAllowedForUser(userRole, 'view', 'user', userId, currentUserId);
    patients = await CareTeam.getForUser(userId, { pageNumber, pageSize });
  } else if (currentUserId) {
    // Otherwise, fetch patient panel for the current user
    patients = await CareTeam.getForUser(currentUserId, { pageNumber, pageSize });
  } else {
    throw new Error(`Could not get userPatientPanel. User not logged in.`);
  }

  const patientEdges = patients.results.map(
    (patient, i) => formatRelayEdge(patient, patient.id) as IPatientNode,
  );

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = ((pageNumber + 1) * pageSize) < patients.total;

  return {
    edges: patientEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}
