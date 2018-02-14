import {
  IRiskAreaGroupCreateInput,
  IRiskAreaGroupDeleteInput,
  IRiskAreaGroupEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import RiskAreaGroup from '../models/risk-area-group';
import checkUserPermissions from './shared/permissions-check';
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
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['riskAreaGroups']> {
  await checkUserPermissions(userId, permissions, 'view', 'riskAreaGroup', txn);

  return RiskAreaGroup.getAll(txn);
}

export async function resolveRiskAreaGroup(
  root: any,
  args: { riskAreaGroupId: string },
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['riskAreaGroup']> {
  await checkUserPermissions(userId, permissions, 'view', 'riskAreaGroup', txn);

  return RiskAreaGroup.get(args.riskAreaGroupId, txn);
}

export async function resolveRiskAreaGroupForPatient(
  root: any,
  args: { riskAreaGroupId: string; patientId: string },
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['riskAreaGroupForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return RiskAreaGroup.getForPatient(args.riskAreaGroupId, args.patientId, txn);
}

export async function riskAreaGroupCreate(
  root: any,
  { input }: IRiskAreaGroupCreateArgs,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['riskAreaGroupCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'riskAreaGroup', txn);

  return RiskAreaGroup.create(input, txn);
}

export async function riskAreaGroupEdit(
  root: any,
  args: IEditRiskAreaGroupOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['riskAreaGroupEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'riskAreaGroup', txn);

  // TODO: fix typings here
  return RiskAreaGroup.edit(args.input as any, args.input.riskAreaGroupId, txn);
}

export async function riskAreaGroupDelete(
  root: any,
  args: IDeleteRiskAreaGroupOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['riskAreaGroupDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'riskAreaGroup', txn);

  return RiskAreaGroup.delete(args.input.riskAreaGroupId, txn);
}
