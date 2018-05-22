import { transaction } from 'objection';
import {
  IRiskAreaGroupCreateInput,
  IRiskAreaGroupDeleteInput,
  IRiskAreaGroupEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import RiskAreaGroup from '../models/risk-area-group';
import checkUserPermissions, { validateGlassBreak } from './shared/permissions-check';
import { formatRiskAreaGroupForPatient } from './shared/risk-area-group-format-for-patient';
import { IContext } from './shared/utils';

export interface IRiskAreaGroupCreateArgs {
  input: IRiskAreaGroupCreateInput;
}

export interface IResolveRiskAreaGroupOptions {
  riskAreaGroupId: string;
}

export interface IEditRiskAreaGroupOptions {
  input: IRiskAreaGroupEditInput;
}

export interface IDeleteRiskAreaGroupOptions {
  input: IRiskAreaGroupDeleteInput;
}

export async function resolveRiskAreaGroups(
  root: any,
  args: any,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['riskAreaGroups']> {
  return transaction(testTransaction || RiskAreaGroup.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'riskAreaGroup', txn);

    return RiskAreaGroup.getAll(txn);
  });
}

export async function resolveRiskAreaGroup(
  root: any,
  args: { riskAreaGroupId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['riskAreaGroup']> {
  return transaction(testTransaction || RiskAreaGroup.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'riskAreaGroup', txn);

    return RiskAreaGroup.get(args.riskAreaGroupId, txn);
  });
}

export async function resolveRiskAreaGroupForPatient(
  root: any,
  args: { riskAreaGroupId: string; patientId: string; glassBreakId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['riskAreaGroupForPatient']> {
  return transaction(testTransaction || RiskAreaGroup.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
    await validateGlassBreak(
      userId!,
      permissions,
      'patient',
      args.patientId,
      txn,
      args.glassBreakId,
    );

    const riskAreaGroupForPatient = await RiskAreaGroup.getForPatient(
      args.riskAreaGroupId,
      args.patientId,
      txn,
    );
    return formatRiskAreaGroupForPatient(riskAreaGroupForPatient);
  });
}

export async function resolveRiskAreaGroupsForPatient(
  root: any,
  args: { patientId: string; glassBreakId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['riskAreaGroupsForPatient']> {
  return transaction(testTransaction || RiskAreaGroup.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
    await validateGlassBreak(
      userId!,
      permissions,
      'patient',
      args.patientId,
      txn,
      args.glassBreakId,
    );

    const riskAreaGroups = await RiskAreaGroup.getAllForPatient(args.patientId, txn);
    return riskAreaGroups.map(formatRiskAreaGroupForPatient);
  });
}

export async function riskAreaGroupCreate(
  root: any,
  { input }: IRiskAreaGroupCreateArgs,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['riskAreaGroupCreate']> {
  return transaction(testTransaction || RiskAreaGroup.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'riskAreaGroup', txn);

    return RiskAreaGroup.create(input, txn);
  });
}

export async function riskAreaGroupEdit(
  root: any,
  args: IEditRiskAreaGroupOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['riskAreaGroupEdit']> {
  return transaction(testTransaction || RiskAreaGroup.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'riskAreaGroup', txn);

    // TODO: fix typings here
    return RiskAreaGroup.edit(args.input as any, args.input.riskAreaGroupId, txn);
  });
}

export async function riskAreaGroupDelete(
  root: any,
  args: IDeleteRiskAreaGroupOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['riskAreaGroupDelete']> {
  return transaction(testTransaction || RiskAreaGroup.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'riskAreaGroup', txn);

    return RiskAreaGroup.delete(args.input.riskAreaGroupId, txn);
  });
}
