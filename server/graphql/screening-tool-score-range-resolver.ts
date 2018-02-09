import {
  IRootMutationType,
  IRootQueryType,
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
): Promise<IRootMutationType['screeningToolScoreRangeCreate']> {
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'screeningTool');
  checkUserLoggedIn(userId);

  const screeningToolScoreRange = await ScreeningToolScoreRange.create(input as any, txn);

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}

export async function resolveScreeningToolScoreRanges(
  root: any,
  args: any,
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['screeningToolScoreRanges']> {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningToolScoreRanges = await ScreeningToolScoreRange.getAll(txn);

  return screeningToolScoreRanges.map(screeningToolScoreRange =>
    ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange),
  );
}

export async function resolveScreeningToolScoreRangesForScreeningTool(
  root: any,
  args: { screeningToolId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['screeningToolScoreRangesForScreeningTool']> {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningToolScoreRanges = await ScreeningToolScoreRange.getForScreeningTool(
    args.screeningToolId,
    txn,
  );

  return screeningToolScoreRanges.map(screeningToolScoreRange =>
    ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange),
  );
}

export async function resolveScreeningToolScoreRange(
  root: any,
  args: { screeningToolScoreRangeId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['screeningToolScoreRange']> {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningToolScoreRange = await ScreeningToolScoreRange.get(
    args.screeningToolScoreRangeId,
    txn,
  );

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}

export async function resolveScreeningToolScoreRangeForScoreAndScreeningTool(
  root: any,
  args: { screeningToolId: string; score: number },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['screeningToolScoreRangeForScoreAndScreeningTool']> {
  await accessControls.isAllowed(userRole, 'view', 'screeningTool');

  const screeningToolScoreRange = await ScreeningToolScoreRange.getByScoreForScreeningTool(
    args.score,
    args.screeningToolId,
    txn,
  );

  if (!screeningToolScoreRange) {
    return null;
  }

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}

export async function screeningToolScoreRangeEdit(
  rot: any,
  args: IEditScreeningToolScoreRangeOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['screeningToolScoreRangeEdit']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'screeningTool');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  const screeningToolScoreRange = await ScreeningToolScoreRange.edit(
    args.input.screeningToolScoreRangeId,
    args.input as any,
    txn,
  );

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}

export async function screeningToolScoreRangeDelete(
  root: any,
  args: IDeleteScreeningToolScoreRangeOptions,
  { db, userId, userRole, txn }: IContext,
): Promise<IRootMutationType['screeningToolScoreRangeDelete']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'screeningTool');
  checkUserLoggedIn(userId);

  const screeningToolScoreRange = await ScreeningToolScoreRange.delete(
    args.input.screeningToolScoreRangeId,
    txn,
  );

  return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
}
