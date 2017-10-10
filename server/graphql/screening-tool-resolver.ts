import { pickBy } from 'lodash';
import {
  IScreeningToolCreateInput,
  IScreeningToolDeleteInput,
  IScreeningToolEditInput,
} from 'schema';
import ScreeningTool from '../models/screening-tool';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IScreeningToolCreateArgs {
  input: IScreeningToolCreateInput;
}

export interface IResolveScreeningToolOptions {
  screeningToolId: string;
}

export interface IEditScreeningToolOptions {
  input: IScreeningToolEditInput;
}

export interface IDeleteScreeningToolOptions {
  input: IScreeningToolDeleteInput;
}

export async function screeningToolCreate(
  root: any,
  { input }: IScreeningToolCreateArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'screeningTool');
  checkUserLoggedIn(userId);

  return await ScreeningTool.create(input as any);
}

export async function resolveScreeningTools(root: any, args: any, { db, userRole }: IContext) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  return await ScreeningTool.getAll();
}

export async function resolveScreeningToolsForRiskArea(
  root: any,
  args: { riskAreaId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  return await ScreeningTool.getForRiskArea(args.riskAreaId);
}

export async function resolveScreeningTool(
  root: any,
  args: { screeningToolId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  return await ScreeningTool.get(args.screeningToolId);
}

export async function screeningToolEdit(
  rot: any,
  args: IEditScreeningToolOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'screeningTool');
  checkUserLoggedIn(userId);

  const cleanedParams = pickBy<IScreeningToolEditInput, {}>(args.input) as any;
  return await ScreeningTool.edit(args.input.screeningToolId, cleanedParams);
}

export async function screeningToolDelete(
  root: any,
  args: IDeleteScreeningToolOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'screeningTool');
  checkUserLoggedIn(userId);

  return await ScreeningTool.delete(args.input.screeningToolId);
}
