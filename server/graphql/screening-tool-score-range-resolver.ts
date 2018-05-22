import { transaction } from 'objection';
import {
  IRootMutationType,
  IRootQueryType,
  IScreeningToolScoreRangeCreateInput,
  IScreeningToolScoreRangeDeleteInput,
  IScreeningToolScoreRangeEditInput,
} from 'schema';
import ScreeningToolScoreRange from '../models/screening-tool-score-range';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['screeningToolScoreRangeCreate']> {
  return transaction(testTransaction || ScreeningToolScoreRange.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'screeningToolScoreRange', txn);

    const screeningToolScoreRange = await ScreeningToolScoreRange.create(input as any, txn);

    return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
  });
}

export async function resolveScreeningToolScoreRanges(
  root: any,
  args: any,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['screeningToolScoreRanges']> {
  return transaction(testTransaction || ScreeningToolScoreRange.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'screeningToolScoreRange', txn);

    const screeningToolScoreRanges = await ScreeningToolScoreRange.getAll(txn);

    return screeningToolScoreRanges.map(screeningToolScoreRange =>
      ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange),
    );
  });
}

export async function resolveScreeningToolScoreRangesForScreeningTool(
  root: any,
  args: { screeningToolId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['screeningToolScoreRangesForScreeningTool']> {
  return transaction(testTransaction || ScreeningToolScoreRange.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'screeningToolScoreRange', txn);

    const screeningToolScoreRanges = await ScreeningToolScoreRange.getForScreeningTool(
      args.screeningToolId,
      txn,
    );

    return screeningToolScoreRanges.map(screeningToolScoreRange =>
      ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange),
    );
  });
}

export async function resolveScreeningToolScoreRange(
  root: any,
  args: { screeningToolScoreRangeId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['screeningToolScoreRange']> {
  return transaction(testTransaction || ScreeningToolScoreRange.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'screeningToolScoreRange', txn);

    const screeningToolScoreRange = await ScreeningToolScoreRange.get(
      args.screeningToolScoreRangeId,
      txn,
    );

    return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
  });
}

export async function resolveScreeningToolScoreRangeForScoreAndScreeningTool(
  root: any,
  args: { screeningToolId: string; score: number },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['screeningToolScoreRangeForScoreAndScreeningTool']> {
  return transaction(testTransaction || ScreeningToolScoreRange.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'screeningToolScoreRange', txn);

    const screeningToolScoreRange = await ScreeningToolScoreRange.getByScoreForScreeningTool(
      args.score,
      args.screeningToolId,
      txn,
    );

    if (!screeningToolScoreRange) {
      return null;
    }

    return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
  });
}

export async function screeningToolScoreRangeEdit(
  rot: any,
  args: IEditScreeningToolScoreRangeOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['screeningToolScoreRangeEdit']> {
  return transaction(testTransaction || ScreeningToolScoreRange.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'screeningToolScoreRange', txn);

    // TODO: fix typings here
    const screeningToolScoreRange = await ScreeningToolScoreRange.edit(
      args.input.screeningToolScoreRangeId,
      args.input as any,
      txn,
    );

    return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
  });
}

export async function screeningToolScoreRangeDelete(
  root: any,
  args: IDeleteScreeningToolScoreRangeOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['screeningToolScoreRangeDelete']> {
  return transaction(testTransaction || ScreeningToolScoreRange.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'screeningToolScoreRange', txn);

    const screeningToolScoreRange = await ScreeningToolScoreRange.delete(
      args.input.screeningToolScoreRangeId,
      txn,
    );

    return ScreeningToolScoreRange.withMinimumAndMaximumScore(screeningToolScoreRange);
  });
}
