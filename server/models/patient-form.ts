import BaseModel from './base-model';

export interface IPatientFormCreateInput {
  patientId: string;
  userId: string;
  formId: string;
  signedAt: string;
}

/* tslint:disable:check-model-variable */
export default class PatientForm extends BaseModel {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      userId: { type: 'string' },
      formId: { type: 'string' },
      signedAt: { type: 'string' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'userId', 'formId'],
  };

  id!: string;
  patientId!: string;
  userId!: string;
  formId!: string;
  signedAt!: string | null;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string | null;
}
/* tslint:enable:check-model-variable */
