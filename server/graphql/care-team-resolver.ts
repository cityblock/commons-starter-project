import {
  ICareTeamAssignInput,
  ICareTeamInput,
  ICareTeamMakeTeamLeadInput,
  ICareTeamReassignInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import { IPaginationOptions } from '../db';
import { convertCareTeamUser } from '../graphql/shared/converter';
import CareTeam from '../models/care-team';
import ComputedPatientStatus from '../models/computed-patient-status';
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

export interface ICareTeamReassignOptions {
  input: ICareTeamReassignInput;
}

export interface IUserPatientPanelOptions extends IPaginationOptions {
  userId: string;
}

export interface ICareTeamMakeTeamLeadOptions {
  input: ICareTeamMakeTeamLeadInput;
}

export async function careTeamAddUser(
  root: any,
  { input }: ICareTeamOptions,
  { txn, userId, permissions }: IContext,
): Promise<IRootMutationType['careTeamAddUser']> {
  await checkUserPermissions(userId, permissions, 'create', 'careTeam', txn);

  const careTeam = await CareTeam.create({ userId: input.userId, patientId: input.patientId }, txn);

  await ComputedPatientStatus.updateForPatient(input.patientId, input.userId, txn);

  return careTeam;
}

export async function careTeamReassignUser(
  root: any,
  { input }: ICareTeamReassignOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['careTeamReassignUser']> {
  await checkUserPermissions(userId, permissions, 'delete', 'careTeam', txn);

  const careTeam = await CareTeam.reassignUser(
    {
      userId: input.userId,
      patientId: input.patientId,
      reassignedToId: input.reassignedToId,
    },
    txn,
  );

  await ComputedPatientStatus.updateForPatient(input.patientId, input.userId, txn);

  return careTeam;
}

export async function resolvePatientCareTeam(
  root: any,
  { patientId }: IQuery,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientCareTeam']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  const careTeamRecords = await CareTeam.getCareTeamRecordsForPatient(patientId, txn);
  return careTeamRecords.map(careTeamRecord =>
    convertCareTeamUser(careTeamRecord.user, careTeamRecord.isCareTeamLead),
  );
}

export async function careTeamAssignPatients(
  root: any,
  { input }: ICareTeamAssignOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['careTeamAssignPatients']> {
  const { patientIds } = input;
  await checkUserPermissions(userId, permissions, 'create', 'careTeam', txn);

  return CareTeam.createAllForUser({ patientIds, userId: input.userId }, txn);
}

export async function careTeamMakeTeamLead(
  root: any,
  { input }: ICareTeamMakeTeamLeadOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['careTeamMakeTeamLead']> {
  const { patientId } = input;
  // TODO: why doesn't the edit permission work here for green?
  await checkUserPermissions(userId, permissions, 'create', 'careTeam', txn);

  return CareTeam.makeTeamLead({ userId: input.userId, patientId }, txn);
}
