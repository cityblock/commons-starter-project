import { IPatientEdges, IPatientNode } from 'schema';
import { IPaginationOptions } from '../db';
import { convertUser } from '../graphql/shared/converter';
import CareTeam from '../models/care-team';
import accessControls from './shared/access-controls';
import { formatRelayEdge, IContext } from './shared/utils';

interface IQuery {
  patientId: string;
}

interface ICareTeamOptions {
  input: {
    userId: string;
    patientId: string;
  };
}

interface IUserPatientPanelOptions extends IPaginationOptions {
  userId: string;
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

export async function resolveUserPatientPanel(
  root: any,
  { userId, pageNumber, pageSize }: IUserPatientPanelOptions,
  { userRole, userId: currentUserId }: IContext,
): Promise<IPatientEdges> {
  await accessControls.isAllowedForUser(userRole, 'view', 'user', userId, currentUserId);

  const patients = await CareTeam.getForUser(userId, { pageNumber, pageSize });

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
