import { pickBy } from 'lodash';
import {
  IScreeningToolScoreRangeCreateInput,
  IScreeningToolScoreRangeDeleteInput,
  IScreeningToolScoreRangeEditInput,
} from 'schema';
import ScreeningToolScoreRange from '../models/screening-tool-score-range';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IScreeningToolScoreRangeCreateArgs {
  input: IScreeningToolScoreRangeCreateInput;
}

export interface IResolveScreeningToolScoreRangeOptions {
  screeningToolScoreRangeId: string;
}

export interface IEditScreeningToolScoreRangeOptions {
  input: IScreeningToolScoreRangeEditInput;
}

export interface IDeleteScreeningToolScoreRangeOptions {
  input: IScreeningToolScoreRangeDeleteInput;
}

export async function screeningToolScoreRangeCreate(
  root: any,
  { input }: IScreeningToolScoreRangeCreateArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'screeningTool');
  checkUserLoggedIn(userId);

  const screeningToolScoreRange = await ScreeningToolScoreRange.create(input as any);

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}

export async function resolveScreeningToolScoreRanges(
  root: any,
  args: any,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningToolScoreRanges = await ScreeningToolScoreRange.getAll();

  return screeningToolScoreRanges.map(screeningToolScoreRange =>
    ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange),
  );
}

export async function resolveScreeningToolScoreRangesForScreeningTool(
  root: any,
  args: { screeningToolId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningToolScoreRanges = await ScreeningToolScoreRange.getForScreeningTool(
    args.screeningToolId,
  );

  return screeningToolScoreRanges.map(screeningToolScoreRange =>
    ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange),
  );
}

export async function resolveScreeningToolScoreRange(
  root: any,
  args: { screeningToolScoreRangeId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningToolScoreRange = await ScreeningToolScoreRange.get(args.screeningToolScoreRangeId);

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}

export async function resolveScreeningToolScoreRangeForScoreAndScreeningTool(
  root: any,
  args: { screeningToolId: string; score: number },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningToolScoreRange = await ScreeningToolScoreRange.getByScoreForScreeningTool(
    args.score,
    args.screeningToolId,
  );

  if (!screeningToolScoreRange) {
    return null;
  }

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}

export async function screeningToolScoreRangeEdit(
  rot: any,
  args: IEditScreeningToolScoreRangeOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'screeningTool');
  checkUserLoggedIn(userId);

  const cleanedParams = pickBy<IScreeningToolScoreRangeEditInput, {}>(args.input) as any;
  const screeningToolScoreRange = await ScreeningToolScoreRange.edit(
    args.input.screeningToolScoreRangeId,
    cleanedParams,
  );

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}

export async function screeningToolScoreRangeDelete(
  root: any,
  args: IDeleteScreeningToolScoreRangeOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'screeningTool');
  checkUserLoggedIn(userId);

  const screeningToolScoreRange = await ScreeningToolScoreRange.delete(
    args.input.screeningToolScoreRangeId,
  );

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}
