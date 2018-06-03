import BaseModel from './base-model';

/* tslint:disable:check-model-variable */
export default class Form extends BaseModel {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['title'],
  };

  id!: string;
  title!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string | null;
}
/* tslint:enable:check-model-variable */
