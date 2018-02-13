import { ICareTeamAssignInput, ICareTeamInput, IRootMutationType, IRootQueryType } from 'schema';
import { IPaginationOptions } from '../db';
import { convertUser } from '../graphql/shared/converter';
import CareTeam from '../models/care-team';
import checkUserPermissions from './shared/permissions-check';
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
  { txn, userId, permissions }: IContext,
): Promise<IRootMutationType['careTeamAddUser']> {
  await checkUserPermissions(userId, permissions, 'create', 'careTeam', txn);

  return CareTeam.create({ userId: input.userId, patientId: input.patientId }, txn);
}

export async function careTeamRemoveUser(
  source: any,
  { input }: ICareTeamOptions,
  { txn, userId, permissions }: IContext,
): Promise<IRootMutationType['careTeamRemoveUser']> {
  await checkUserPermissions(userId, permissions, 'delete', 'careTeam', txn);

  return CareTeam.delete({ userId: input.userId, patientId: input.patientId }, txn);
}

export async function resolvePatientCareTeam(
  root: any,
  { patientId }: IQuery,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientCareTeam']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  const users = await CareTeam.getForPatient(patientId, txn);
  return users.map(convertUser);
}

export async function careTeamAssignPatients(
  source: any,
  { input }: ICareTeamAssignOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['careTeamAssignPatients']> {
  const { patientIds } = input;
  await checkUserPermissions(userId, permissions, 'create', 'careTeam', txn);

  return CareTeam.createAllForUser({ patientIds, userId: input.userId }, txn);
}
