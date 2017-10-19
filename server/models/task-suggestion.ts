import { transaction, Model, RelationMappings } from 'objection';
import Answer from './answer';
import BaseModel from './base-model';
import TaskTemplate from './task-template';

export interface ITaskSuggestionEditableFields {
  taskTemplateId: string;
  answerId: string;
}

/* tslint:disable:member-ordering */
export default class TaskSuggestion extends BaseModel {
  taskId: string;
  taskTemplate: TaskTemplate;
  answerId: string;
  answer: Answer;

  static tableName = 'task_suggestion';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      answerId: { type: 'string' },
      taskTemplateId: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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

  static async getForTaskTemplate(taskTemplate: string): Promise<Answer[]> {
    const taskSuggestions = await this.query()
      .eager('answer')
      .where('taskTemplateId', taskTemplate)
      .andWhere('deletedAt', null)
      .orderBy('createdAt', 'asc');
    return taskSuggestions.map((taskSuggestion: TaskSuggestion) => taskSuggestion.answer);
  }

  static async getForAnswer(answerId: string): Promise<TaskTemplate[]> {
    const taskSuggestions = await this.query()
      .eager('taskTemplate')
      .where('answerId', answerId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt');

    return taskSuggestions.map((taskSuggestion: TaskSuggestion) => taskSuggestion.taskTemplate);
  }

  static async create({
    taskTemplateId,
    answerId,
  }: ITaskSuggestionEditableFields): Promise<TaskTemplate[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    await transaction(TaskSuggestion, async TaskSuggestionWithTransaction => {
      const relations = await TaskSuggestionWithTransaction.query().where({
        taskTemplateId,
        answerId,
        deletedAt: null,
      });

      if (relations.length < 1) {
        await TaskSuggestionWithTransaction.query().insert({
          taskTemplateId,
          answerId,
        });
      }
    });

    return await this.getForAnswer(answerId);
  }

  static async delete({
    taskTemplateId,
    answerId,
  }: ITaskSuggestionEditableFields): Promise<TaskTemplate[]> {
    await this.query()
      .where({
        taskTemplateId,
        answerId,
        deletedAt: null,
      })
      .update({ deletedAt: new Date().toISOString() });

    return await this.getForAnswer(answerId);
  }
}
/* tslint:disable:member-ordering */
