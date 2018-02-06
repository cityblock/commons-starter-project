import { ICareTeamInput, IUser } from 'schema';
import { IPaginationOptions } from '../db';
import { convertUser } from '../graphql/shared/converter';
import CareTeam from '../models/care-team';
import User from '../models/user';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

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
  source: any,
  { input }: ICareTeamOptions,
  context: IContext,
): Promise<User[]> {
  const { userRole, txn } = context;
  const { userId, patientId } = input;
  await accessControls.isAllowed(userRole, 'edit', 'careTeam');

  return CareTeam.create({ userId, patientId }, txn);
}

export async function careTeamRemoveUser(
  source: any,
  { input }: ICareTeamOptions,
  context: IContext,
) {
  const { userRole, txn } = context;
  const { userId, patientId } = input;
  await accessControls.isAllowed(userRole, 'edit', 'careTeam');

  return CareTeam.delete({ userId, patientId }, txn);
}

export async function resolvePatientCareTeam(
  root: any,
  { patientId }: IQuery,
  { userRole, userId, txn }: IContext,
): Promise<IUser[]> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const users = await CareTeam.getForPatient(patientId, txn);
  return users.map(convertUser);
}
