import { pickBy } from 'lodash';
import {
  IRiskAreaGroup,
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

export async function resolveRiskAreaGroups(
  root: any,
  args: any,
  { db, userRole }: IContext,
): Promise<IRiskAreaGroup[]> {
  await accessControls.isAllowed(userRole, 'view', 'riskAreaGroup');

  return await RiskAreaGroup.getAll();
}

export async function resolveRiskAreaGroup(
  root: any,
  args: { riskAreaGroupId: string },
  { db, userRole }: IContext,
): Promise<IRiskAreaGroup> {
  await accessControls.isAllowed(userRole, 'view', 'riskAreaGroup');

  return await RiskAreaGroup.get(args.riskAreaGroupId);
}

export async function riskAreaGroupCreate(
  root: any,
  { input }: IRiskAreaGroupCreateArgs,
  { userId, userRole }: IContext,
): Promise<IRiskAreaGroup> {
  await accessControls.isAllowed(userRole, 'create', 'riskAreaGroup');
  checkUserLoggedIn(userId);

  return await RiskAreaGroup.create(input);
}

export async function riskAreaGroupEdit(
  root: any,
  args: IEditRiskAreaGroupOptions,
  { db, userId, userRole }: IContext,
): Promise<IRiskAreaGroup> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'riskAreaGroup');
  checkUserLoggedIn(userId);

  const cleanedParams = pickBy<IRiskAreaGroupEditInput>(args.input) as any;
  return await RiskAreaGroup.edit(cleanedParams, args.input.riskAreaGroupId);
}

export async function riskAreaGroupDelete(
  root: any,
  args: IDeleteRiskAreaGroupOptions,
  { db, userId, userRole }: IContext,
): Promise<IRiskAreaGroup> {
  await accessControls.isAllowedForUser(userRole, 'delete', 'riskAreaGroup');
  checkUserLoggedIn(userId);

  return await RiskAreaGroup.delete(args.input.riskAreaGroupId);
}
