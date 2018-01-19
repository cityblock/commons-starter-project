import {
  IRiskAreaCreateInput,
  IRiskAreaDeleteInput,
  IRiskAreaEditInput,
  IRiskAreaSummary,
} from 'schema';
import RiskArea, { IRiskScore } from '../models/risk-area';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IRiskAreaCreateArgs {
  input: IRiskAreaCreateInput;
}

export interface IResolveRiskAreaOptions {
  riskAreaId: string;
}

export interface IEditRiskAreaOptions {
  input: IRiskAreaEditInput;
}

export interface IDeleteRiskAreaOptions {
  input: IRiskAreaDeleteInput;
}

export async function riskAreaCreate(root: any, { input }: IRiskAreaCreateArgs, context: IContext) {
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'riskArea');
  checkUserLoggedIn(userId);

  return await RiskArea.create(input, txn);
}

export async function resolveRiskAreas(root: any, args: any, { db, userRole, txn }: IContext) {
  await accessControls.isAllowed(userRole, 'view', 'riskArea');

  return await RiskArea.getAll(txn);
}

export async function resolveRiskArea(
  root: any,
  args: { riskAreaId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'riskArea');

  return await RiskArea.get(args.riskAreaId, txn);
}

export async function riskAreaEdit(
  root: any,
  args: IEditRiskAreaOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'riskArea');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return await RiskArea.edit(args.input as any, args.input.riskAreaId, txn);
}

export async function riskAreaDelete(
  root: any,
  args: IDeleteRiskAreaOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'delete', 'riskArea');
  checkUserLoggedIn(userId);

  return await RiskArea.delete(args.input.riskAreaId, txn);
}

export async function resolvePatientRiskAreaSummary(
  root: any,
  args: { riskAreaId: string; patientId: string },
  { db, userRole, txn }: IContext,
): Promise<IRiskAreaSummary> {
  await accessControls.isAllowedForUser(userRole, 'view', 'riskArea');
  const { summary, started, lastUpdated } = await RiskArea.getSummaryForPatient(
    args.riskAreaId,
    args.patientId,
    txn,
  );

  return { summary, started, lastUpdated };
}

export async function resolvePatientRiskAreaRiskScore(
  root: any,
  args: { riskAreaId: string; patientId: string },
  { db, userRole, txn }: IContext,
): Promise<IRiskScore> {
  await accessControls.isAllowedForUser(userRole, 'view', 'riskArea');
  return await RiskArea.getRiskScoreForPatient(args.riskAreaId, args.patientId, txn);
}
