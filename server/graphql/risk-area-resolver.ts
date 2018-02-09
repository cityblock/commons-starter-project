import {
  IRiskAreaCreateInput,
  IRiskAreaDeleteInput,
  IRiskAreaEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import RiskArea from '../models/risk-area';
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

export async function riskAreaCreate(
  root: any,
  { input }: IRiskAreaCreateArgs,
  context: IContext,
): Promise<IRootMutationType['riskAreaCreate']> {
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'riskArea');
  checkUserLoggedIn(userId);

  return RiskArea.create(input, txn);
}

export async function resolveRiskAreas(
  root: any,
  args: any,
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['riskAreas']> {
  await accessControls.isAllowed(userRole, 'view', 'riskArea');

  return RiskArea.getAll(txn);
}

export async function resolveRiskArea(
  root: any,
  args: { riskAreaId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['riskArea']> {
  await accessControls.isAllowed(userRole, 'view', 'riskArea');

  return RiskArea.get(args.riskAreaId, txn);
}

export async function riskAreaEdit(
  root: any,
  args: IEditRiskAreaOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['riskAreaEdit']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'riskArea');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return RiskArea.edit(args.input as any, args.input.riskAreaId, txn);
}

export async function riskAreaDelete(
  root: any,
  args: IDeleteRiskAreaOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['riskAreaDelete']> {
  await accessControls.isAllowedForUser(userRole, 'delete', 'riskArea');
  checkUserLoggedIn(userId);

  return RiskArea.delete(args.input.riskAreaId, txn);
}

export async function resolvePatientRiskAreaSummary(
  root: any,
  args: { riskAreaId: string; patientId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['patientRiskAreaSummary']> {
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
): Promise<IRootQueryType['patientRiskAreaRiskScore']> {
  await accessControls.isAllowedForUser(userRole, 'view', 'riskArea');
  return RiskArea.getRiskScoreForPatient(args.riskAreaId, args.patientId, txn);
}
