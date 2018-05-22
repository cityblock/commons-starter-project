import { transaction } from 'objection';
import {
  IRootMutationType,
  IRootQueryType,
  IScreeningToolCreateInput,
  IScreeningToolDeleteInput,
  IScreeningToolEditInput,
} from 'schema';
import ScreeningTool from '../models/screening-tool';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['screeningToolCreate']> {
  return transaction(testTransaction || ScreeningTool.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'screeningTool', txn);

    return ScreeningTool.create(input as any, txn);
  });
}

export async function resolveScreeningTools(
  root: any,
  args: any,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['screeningTools']> {
  return transaction(testTransaction || ScreeningTool.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'screeningTool', txn);
    const screeningTools = await ScreeningTool.getAll(txn);

    return screeningTools.map(screeningTool =>
      ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool),
    );
  });
}

export async function resolveScreeningTool(
  root: any,
  args: { screeningToolId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['screeningTool']> {
  return transaction(testTransaction || ScreeningTool.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'screeningTool', txn);

    const screeningTool = await ScreeningTool.get(args.screeningToolId, txn);

    return ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool);
  });
}

export async function screeningToolEdit(
  rot: any,
  args: IEditScreeningToolOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['screeningToolEdit']> {
  return transaction(testTransaction || ScreeningTool.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'screeningTool', txn);

    // TODO: fix typings here
    const screeningTool = await ScreeningTool.edit(
      args.input.screeningToolId,
      args.input as any,
      txn,
    );

    return ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool);
  });
}

export async function screeningToolDelete(
  root: any,
  args: IDeleteScreeningToolOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['screeningToolDelete']> {
  return transaction(testTransaction || ScreeningTool.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'screeningTool', txn);

    const screeningTool = await ScreeningTool.delete(args.input.screeningToolId, txn);

    return ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool);
  });
}
