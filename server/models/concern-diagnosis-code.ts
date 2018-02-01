import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Concern from './concern';
import DiagnosisCode from './diagnosis-code';

interface IConcernDiagnosisCodeCreateFields {
  concernId: string;
  diagnosisCodeId: string;
}

/* tslint:disable:member-ordering */
export default class ConcernDiagnosisCode extends BaseModel {
  concernId: string;
  concern: Concern;
  diagnosisCodeId: string;
  diagnosisCode: DiagnosisCode;

  static tableName = 'concern_diagnosis_code';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      concernId: { type: 'string', minLength: 1 },
      diagnosisCodeId: { type: 'string', minLength: 1 },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['concernId', 'diagnosisCodeId'],
  };

  static relationMappings: RelationMappings = {
    concern: {
      relation: Model.HasOneRelation,
      modelClass: 'concern',
      join: {
        from: 'concern_diagnosis_code.concernId',
        to: 'concern.id',
      },
    },
    diagnosisCode: {
      relation: Model.HasOneRelation,
      modelClass: 'diagnosis-code',
      join: {
        from: 'concern_diagnosis_code.diagnosisCodeId',
        to: 'diagnosis_code.id',
      },
    },
  };

  static async create(
    input: IConcernDiagnosisCodeCreateFields,
    txn: Transaction,
  ): Promise<Concern> {
    const { concernId, diagnosisCodeId } = input;
    const existingConcernDiagnosisCode = await this.query(txn)
      .eager('[concern.[diagnosisCodes]]')
      .findOne({ concernId, diagnosisCodeId, deletedAt: null });

    if (existingConcernDiagnosisCode) {
      return existingConcernDiagnosisCode.concern;
    }

    const concernDiagnosisCode = await this.query(txn)
      .eager('[concern.[diagnosisCodes]]')
      .insertAndFetch(input);

    return concernDiagnosisCode.concern;
  }

  static async delete(
    concernId: string,
    diagnosisCodeId: string,
    txn: Transaction,
  ): Promise<Concern> {
    await this.query(txn)
      .where({ concernId, diagnosisCodeId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    return Concern.get(concernId, txn);
  }
}
/* tslint:enable:member-ordering */
