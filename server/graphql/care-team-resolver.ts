import { transaction } from 'objection';
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
import { addJobToQueue } from '../helpers/queue-helpers';
import Mattermost from '../mattermost';
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
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['careTeamAddUser']> {
  return transaction(testTransaction || CareTeam.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'careTeam', txn);

    const careTeam = await CareTeam.create(
      { userId: input.userId, patientId: input.patientId },
      txn,
    );

    await ComputedPatientStatus.updateForPatient(input.patientId, input.userId, txn);

    // add user to patient channel in Mattermost
    const mattermost = Mattermost.get();
    mattermost.queueAddUserToPatientChannel(input.patientId, input.userId);

    // notify user of new contact
    addJobToQueue('patientContactEdit', {
      patientId: input.patientId,
      type: 'addCareTeamMember',
      userId: input.userId,
    });

    return careTeam;
  });
}

export async function careTeamReassignUser(
  root: any,
  { input }: ICareTeamReassignOptions,
  { permissions, userId, testTransaction, testConfig }: IContext,
): Promise<IRootMutationType['careTeamReassignUser']> {
  return transaction(testTransaction || CareTeam.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'careTeam', txn);

    const careTeam = await CareTeam.reassignUser(
      {
        userId: input.userId,
        patientId: input.patientId,
        reassignedToId: input.reassignedToId,
      },
      txn,
      testConfig,
    );

    await ComputedPatientStatus.updateForPatient(input.patientId, input.userId, txn);

    // remove user from patient channel in Mattermost
    const mattermost = Mattermost.get();
    await mattermost.removeUserFromPatientChannel(input.patientId, input.userId, txn);

    // notify reassigned user of new contact
    addJobToQueue('patientContactEdit', {
      patientId: input.patientId,
      type: 'addCareTeamMember',
      userId: input.reassignedToId,
    });

    return careTeam;
  });
}

export async function resolvePatientCareTeam(
  root: any,
  { patientId }: IQuery,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['patientCareTeam']> {
  return transaction(testTransaction || CareTeam.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

    const careTeamRecords = await CareTeam.getCareTeamRecordsForPatient(patientId, txn);
    return careTeamRecords.map(careTeamRecord =>
      convertCareTeamUser(careTeamRecord.user, careTeamRecord.isCareTeamLead),
    );
  });
}

export async function careTeamAssignPatients(
  root: any,
  { input }: ICareTeamAssignOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['careTeamAssignPatients']> {
  const { patientIds } = input;
  return transaction(testTransaction || CareTeam.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'careTeam', txn);

    const careTeam = await CareTeam.createAllForUser({ patientIds, userId: input.userId }, txn);

    await ComputedPatientStatus.updateForMultiplePatients(patientIds, userId!, txn);

    // add user to patient channels in Mattermost
    const mattermost = Mattermost.get();

    patientIds.forEach(patientId => {
      mattermost.queueAddUserToPatientChannel(patientId, input.userId);
    });

    // notify user of new contacts
    addJobToQueue('patientContactEdit', {
      patientIds,
      type: 'addCareTeamMember',
      userId: input.userId,
    });

    return careTeam;
  });
}

export async function careTeamMakeTeamLead(
  root: any,
  { input }: ICareTeamMakeTeamLeadOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['careTeamMakeTeamLead']> {
  const { patientId } = input;
  // TODO: why doesn't the edit permission work here for green?
  return transaction(testTransaction || CareTeam.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'careTeam', txn);

    return CareTeam.makeTeamLead({ userId: input.userId, patientId }, txn);
  });
}
