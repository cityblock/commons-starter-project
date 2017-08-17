import { pickBy } from 'lodash';
import {
  IRiskAreaCreateInput,
  IRiskAreaDeleteInput,
  IRiskAreaEditInput,
  IRiskAreaSummary,
} from 'schema';
import RiskArea, { IRiskScore } from '../models/risk-area';
import accessControls from './shared/access-controls';
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

export async function riskAreaCreate(root: any, { input }: IRiskAreaCreateArgs, context: IContext) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'riskArea');
  if (!userId) {
    throw new Error('not logged in');
  }

  // TODO: fix typings here
  return await RiskArea.create(input as any);
}

export async function resolveRiskAreas(
  root: any, args: any, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'riskArea');

  return await RiskArea.getAll();
}

export async function resolveRiskArea(
  root: any, args: { riskAreaId: string }, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'riskArea');

  return await RiskArea.get(args.riskAreaId);
}

export async function riskAreaEdit(
  root: any, args: IEditRiskAreaOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'riskArea');
  if (!userId) {
    throw new Error('not logged in');
  }
  // TODO: fix typings here
  const cleanedParams = pickBy<IRiskAreaEditInput, {}>(args.input) as any;
  return await RiskArea.edit(cleanedParams, args.input.riskAreaId);
}

export async function riskAreaDelete(
  root: any, args: IDeleteRiskAreaOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'riskArea');
  if (!userId) {
    throw new Error('not logged in');
  }
  return await RiskArea.delete(args.input.riskAreaId);
}

export async function resolvePatientRiskAreaSummary(
  root: any, args: { riskAreaId: string, patientId: string }, { db, userRole }: IContext,
): Promise<IRiskAreaSummary> {
  await accessControls.isAllowedForUser(userRole, 'view', 'riskArea');
  const {
    summary,
    started,
    lastUpdated,
  } = await RiskArea.getSummaryForPatient(args.riskAreaId, args.patientId);

  return { summary, started, lastUpdated };
}

export async function resolvePatientRiskAreaRiskScore(
  root: any, args: { riskAreaId: string, patientId: string }, { db, userRole }: IContext,
): Promise<IRiskScore> {
  await accessControls.isAllowedForUser(userRole, 'view', 'riskArea');
  return await RiskArea.getRiskScoreForPatient(args.riskAreaId, args.patientId);
}
