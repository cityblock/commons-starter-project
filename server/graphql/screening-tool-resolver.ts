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
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'screeningTool');
  checkUserLoggedIn(userId);

  return ScreeningTool.create(input as any, txn);
}

export async function resolveScreeningTools(root: any, args: any, { db, userRole, txn }: IContext) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningTools = await ScreeningTool.getAll(txn);

  return screeningTools.map(screeningTool =>
    ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool),
  );
}

export async function resolveScreeningToolsForRiskArea(
  root: any,
  args: { riskAreaId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningTools = await ScreeningTool.getForRiskArea(args.riskAreaId, txn);

  return screeningTools.map(screeningTool =>
    ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool),
  );
}

export async function resolveScreeningTool(
  root: any,
  args: { screeningToolId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningTool = await ScreeningTool.get(args.screeningToolId, txn);

  return ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool);
}

export async function screeningToolEdit(
  rot: any,
  args: IEditScreeningToolOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'screeningTool');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  const screeningTool = await ScreeningTool.edit(
    args.input.screeningToolId,
    args.input as any,
    txn,
  );

  return ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool);
}

export async function screeningToolDelete(
  root: any,
  args: IDeleteScreeningToolOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'screeningTool');
  checkUserLoggedIn(userId);

  const screeningTool = await ScreeningTool.delete(args.input.screeningToolId, txn);

  return ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool);
}
