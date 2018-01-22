import {
  IRiskAreaGroupCreateInput,
  IRiskAreaGroupDeleteInput,
  IRiskAreaGroupEditInput,
} from 'schema';
import RiskAreaGroup from '../models/risk-area-group';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

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

export async function resolveRiskAreaGroups(root: any, args: any, { db, userRole, txn }: IContext) {
  await accessControls.isAllowed(userRole, 'view', 'riskAreaGroup');

  return await RiskAreaGroup.getAll(txn);
}

export async function resolveRiskAreaGroup(
  root: any,
  args: { riskAreaGroupId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'riskAreaGroup');

  return await RiskAreaGroup.get(args.riskAreaGroupId, txn);
}

export async function resolveRiskAreaGroupForPatient(
  root: any,
  args: { riskAreaGroupId: string; patientId: string },
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'riskAreaGroup');
  checkUserLoggedIn(userId);

  return await RiskAreaGroup.getForPatient(args.riskAreaGroupId, args.patientId, txn);
}

export async function riskAreaGroupCreate(
  root: any,
  { input }: IRiskAreaGroupCreateArgs,
  { userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'create', 'riskAreaGroup');
  checkUserLoggedIn(userId);

  return await RiskAreaGroup.create(input, txn);
}

export async function riskAreaGroupEdit(
  root: any,
  args: IEditRiskAreaGroupOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'riskAreaGroup');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return await RiskAreaGroup.edit(args.input as any, args.input.riskAreaGroupId, txn);
}

export async function riskAreaGroupDelete(
  root: any,
  args: IDeleteRiskAreaGroupOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'delete', 'riskAreaGroup');
  checkUserLoggedIn(userId);

  return await RiskAreaGroup.delete(args.input.riskAreaGroupId, txn);
}
