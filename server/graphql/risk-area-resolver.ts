import {
  IRiskAreaCreateInput,
  IRiskAreaDeleteInput,
  IRiskAreaEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import RiskArea from '../models/risk-area';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['riskAreaCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'riskArea', txn);

  return RiskArea.create(input, txn);
}

export async function resolveRiskAreas(
  root: any,
  args: any,
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['riskAreas']> {
  await checkUserPermissions(userId, permissions, 'view', 'riskArea', txn);

  return RiskArea.getAll(txn);
}

export async function resolveRiskArea(
  root: any,
  args: { riskAreaId: string },
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['riskArea']> {
  await checkUserPermissions(userId, permissions, 'view', 'riskArea', txn);

  return RiskArea.get(args.riskAreaId, txn);
}

export async function riskAreaEdit(
  root: any,
  args: IEditRiskAreaOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['riskAreaEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'riskArea', txn);

  // TODO: fix typings here
  return RiskArea.edit(args.input as any, args.input.riskAreaId, txn);
}

export async function riskAreaDelete(
  root: any,
  args: IDeleteRiskAreaOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['riskAreaDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'riskArea', txn);

  return RiskArea.delete(args.input.riskAreaId, txn);
}

export async function resolvePatientRiskAreaSummary(
  root: any,
  args: { riskAreaId: string; patientId: string },
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['patientRiskAreaSummary']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

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
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['patientRiskAreaRiskScore']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return RiskArea.getRiskScoreForPatient(args.riskAreaId, args.patientId, txn);
}
