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
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['screeningToolCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'screeningTool', txn);

  return ScreeningTool.create(input as any, txn);
}

export async function resolveScreeningTools(
  root: any,
  args: any,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['screeningTools']> {
  await checkUserPermissions(userId, permissions, 'view', 'screeningTool', txn);
  const screeningTools = await ScreeningTool.getAll(txn);

  return screeningTools.map(screeningTool =>
    ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool),
  );
}

export async function resolveScreeningTool(
  root: any,
  args: { screeningToolId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['screeningTool']> {
  await checkUserPermissions(userId, permissions, 'view', 'screeningTool', txn);

  const screeningTool = await ScreeningTool.get(args.screeningToolId, txn);

  return ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool);
}

export async function screeningToolEdit(
  rot: any,
  args: IEditScreeningToolOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['screeningToolEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'screeningTool', txn);

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
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['screeningToolDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'screeningTool', txn);

  const screeningTool = await ScreeningTool.delete(args.input.screeningToolId, txn);

  return ScreeningTool.withFormattedScreeningToolScoreRanges(screeningTool);
}
