import { transaction } from 'objection';
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
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['taskTemplatesForAnswer']> {
  return transaction(testTransaction || TaskSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'taskSuggestion', txn);
    return TaskSuggestion.getForAnswer(args.answerId, txn);
  });
}

export async function taskSuggestionCreate(
  root: any,
  args: ITaskSuggestOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['taskSuggestionCreate']> {
  return transaction(testTransaction || TaskSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'taskSuggestion', txn);
    return TaskSuggestion.create(
      {
        answerId: args.input.answerId,
        taskTemplateId: args.input.taskTemplateId,
      },
      txn,
    );
  });
}

export async function taskSuggestionDelete(
  root: any,
  args: ITaskSuggestOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['taskSuggestionDelete']> {
  return transaction(testTransaction || TaskSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'taskSuggestion', txn);
    return TaskSuggestion.delete(
      {
        answerId: args.input.answerId,
        taskTemplateId: args.input.taskTemplateId,
      },
      txn,
    );
  });
}
