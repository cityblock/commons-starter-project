import { ICareTeamAssignInput, ICareTeamInput, IRootMutationType, IRootQueryType } from 'schema';
import { IPaginationOptions } from '../db';
import { convertUser } from '../graphql/shared/converter';
import CareTeam from '../models/care-team';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IQuery {
  patientId: string;
}

export interface ICareTeamOptions {
  input: ICareTeamInput;
}

export interface ICareTeamAssignOptions {
  input: ICareTeamAssignInput;
}

export interface IUserPatientPanelOptions extends IPaginationOptions {
  userId: string;
}

export async function careTeamAddUser(
  source: any,
  { input }: ICareTeamOptions,
  context: IContext,
): Promise<IRootMutationType['careTeamAddUser']> {
  const { userRole, txn } = context;
  const { userId, patientId } = input;
  await accessControls.isAllowed(userRole, 'edit', 'careTeam');

  return CareTeam.create({ userId, patientId }, txn);
}

export async function careTeamRemoveUser(
  source: any,
  { input }: ICareTeamOptions,
  context: IContext,
): Promise<IRootMutationType['careTeamRemoveUser']> {
  const { userRole, txn } = context;
  const { userId, patientId } = input;
  await accessControls.isAllowed(userRole, 'edit', 'careTeam');

  return CareTeam.delete({ userId, patientId }, txn);
}

export async function resolvePatientCareTeam(
  root: any,
  { patientId }: IQuery,
  { userRole, userId, txn }: IContext,
): Promise<IRootQueryType['patientCareTeam']> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const users = await CareTeam.getForPatient(patientId, txn);
  return users.map(convertUser);
}

export async function careTeamAssignPatients(
  source: any,
  { input }: ICareTeamAssignOptions,
  { userRole, txn }: IContext,
): Promise<IRootMutationType['careTeamAssignPatients']> {
  const { patientIds } = input;
  await accessControls.isAllowed(userRole, 'edit', 'careTeam');

  return CareTeam.createAllForUser({ patientIds, userId: input.userId }, txn);
}
