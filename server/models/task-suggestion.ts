import { Model, RelationMappings, Transaction } from 'objection';
import Answer from './answer';
import BaseModel from './base-model';
import TaskTemplate from './task-template';

interface ITaskSuggestionEditableFields {
  taskTemplateId: string;
  answerId: string;
}

/* tslint:disable:member-ordering */
export default class TaskSuggestion extends BaseModel {
  taskId: string;
  taskTemplateId: string;
  taskTemplate: TaskTemplate;
  answerId: string;
  answer: Answer;

  static tableName = 'task_suggestion';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      answerId: { type: 'string', minLength: 1 },
      taskTemplateId: { type: 'string', minLength: 1 },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['answerId', 'taskTemplateId'],
  };

  static relationMappings: RelationMappings = {
    taskTemplate: {
      relation: Model.HasOneRelation,
      modelClass: 'task-template',
      join: {
        from: 'task_suggestion.taskTemplateId',
        to: 'task_template.id',
      },
    },
    answer: {
      relation: Model.HasOneRelation,
      modelClass: 'answer',
      join: {
        from: 'task_suggestion.answerId',
        to: 'answer.id',
      },
    },
  };

  static async getForTaskTemplate(taskTemplate: string, txn: Transaction): Promise<Answer[]> {
    const taskSuggestions = await this.query(txn)
      .eager('answer')
      .where('taskTemplateId', taskTemplate)
      .andWhere('deletedAt', null)
      .orderBy('createdAt', 'asc');
    return taskSuggestions.map((taskSuggestion: TaskSuggestion) => taskSuggestion.answer);
  }

  static async getForAnswer(answerId: string, txn: Transaction): Promise<TaskTemplate[]> {
    const taskSuggestions = await this.query(txn)
      .eager('taskTemplate')
      .where('answerId', answerId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt');

    return taskSuggestions.map((taskSuggestion: TaskSuggestion) => taskSuggestion.taskTemplate);
  }

  static async create(
    { taskTemplateId, answerId }: ITaskSuggestionEditableFields,
    txn: Transaction,
  ): Promise<TaskTemplate[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    const relations = await TaskSuggestion.query(txn).where({
      taskTemplateId,
      answerId,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await TaskSuggestion.query(txn).insert({
        taskTemplateId,
        answerId,
      });
    }
    return this.getForAnswer(answerId, txn);
  }

  static async delete(
    { taskTemplateId, answerId }: ITaskSuggestionEditableFields,
    txn: Transaction,
  ): Promise<TaskTemplate[]> {
    await this.query(txn)
      .where({
        taskTemplateId,
        answerId,
        deletedAt: null,
      })
      .patch({ deletedAt: new Date().toISOString() });

    return this.getForAnswer(answerId, txn);
  }
}
/* tslint:enable:member-ordering */
