import { IRootMutationType, IRootQueryType, ITaskSuggestInput } from 'schema';
import TaskSuggestion from '../models/task-suggestion';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface ITaskSuggestOptions {
  input: ITaskSuggestInput;
}

export async function resolveTaskSuggestionTemplatesForAnswer(
  root: any,
  args: { answerId: string },
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['taskTemplatesForAnswer']> {
  await checkUserPermissions(userId, permissions, 'view', 'taskSuggestion', txn);
  return TaskSuggestion.getForAnswer(args.answerId, txn);
}

export async function taskSuggestionCreate(
  root: any,
  args: ITaskSuggestOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['taskSuggestionCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'taskSuggestion', txn);

  return TaskSuggestion.create(
    {
      answerId: args.input.answerId,
      taskTemplateId: args.input.taskTemplateId,
    },
    txn,
  );
}

export async function taskSuggestionDelete(
  root: any,
  args: ITaskSuggestOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['taskSuggestionDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'taskSuggestion', txn);

  return TaskSuggestion.delete(
    {
      answerId: args.input.answerId,
      taskTemplateId: args.input.taskTemplateId,
    },
    txn,
  );
}
