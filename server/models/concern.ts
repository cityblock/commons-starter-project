import { Model, QueryBuilder, RelationMappings, Transaction } from 'objection';
import Answer from './answer';
import BaseModel from './base-model';
import ConcernDiagnosisCode from './concern-diagnosis-code';
import DiagnosisCode from './diagnosis-code';

interface IConcernEditableFields {
  title: string;
}

interface IAddDiagnosisCodeOptions {
  codesetName: string;
  code: string;
  version: string;
}

export type ConcernOrderOptions = 'createdAt' | 'title' | 'updatedAt';

interface IConcernOrderOptions {
  orderBy: ConcernOrderOptions;
  order: 'asc' | 'desc';
}

const EAGER_QUERY = '[diagnosisCodes]';

/* tslint:disable:member-ordering */
export default class Concern extends BaseModel {
  title: string;
  diagnosisCodes: DiagnosisCode[];

  static tableName = 'concern';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['title'],
  };

  static get relationMappings(): RelationMappings {
    return {
      answers: {
        relation: Model.ManyToManyRelation,
        modelClass: Answer,
        join: {
          from: 'concern.id',
          through: {
            from: 'concern_suggestion.concernId',
            to: 'concern_suggestion.answerId',
          },
          to: 'answer.id',
        },
      },
      diagnosisCodes: {
        relation: Model.ManyToManyRelation,
        modelClass: DiagnosisCode,
        join: {
          from: 'concern.id',
          through: {
            from: 'concern_diagnosis_code.concernId',
            to: 'concern_diagnosis_code.diagnosisCodeId',
          },
          to: 'diagnosis_code.id',
        },
      },
    };
  }

  static async get(concernId: string, txn: Transaction): Promise<Concern> {
    const concern = await this.modifyEager(this.query(txn)).findOne({
      id: concernId,
      deletedAt: null,
    });

    if (!concern) {
      return Promise.reject(`No such concern: ${concernId}`);
    }
    return concern;
  }

  static async create(input: IConcernEditableFields, txn: Transaction) {
    return this.modifyEager(this.query(txn)).insertAndFetch(input);
  }

  static async findOrCreateByTitle(title: string, txn: Transaction): Promise<Concern> {
    const fetchedConcern = await this.modifyEager(this.query(txn))
      .whereRaw('lower("title") = ?', title.toLowerCase())
      .limit(1)
      .first();

    if (fetchedConcern) {
      return fetchedConcern;
    }

    return this.create({ title }, txn);
  }

  static async edit(
    concernId: string,
    concern: Partial<IConcernEditableFields>,
    txn: Transaction,
  ): Promise<Concern> {
    return this.modifyEager(this.query(txn)).patchAndFetchById(concernId, concern);
  }

  static async getAll(
    { orderBy, order }: IConcernOrderOptions,
    txn: Transaction,
  ): Promise<Concern[]> {
    return this.modifyEager(this.query(txn))
      .where('deletedAt', null)
      .orderBy(orderBy, order);
  }

  static async delete(concernId: string, txn: Transaction): Promise<Concern> {
    await this.modifyEager(this.query(txn))
      .where({ id: concernId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const concern = await this.query(txn).findById(concernId);
    if (!concern) {
      return Promise.reject(`No such concern: ${concernId}`);
    }
    return concern;
  }

  static async addDiagnosisCode(
    concernId: string,
    diagnosisCode: IAddDiagnosisCodeOptions,
    txn: Transaction,
  ): Promise<Concern> {
    const { codesetName, code, version } = diagnosisCode;
    const fetchedDiagnosisCode = await DiagnosisCode.getByCodesetNameAndCodeAndVersion(
      codesetName,
      code,
      version,
      txn,
    );

    if (!fetchedDiagnosisCode) {
      return Promise.reject(
        `Cannot find diagnosis code for codeset: ${codesetName} and code: ${code}`,
      );
    }

    await ConcernDiagnosisCode.create(
      {
        concernId,
        diagnosisCodeId: fetchedDiagnosisCode.id,
      },
      txn,
    );

    return this.get(concernId, txn);
  }

  static async removeDiagnosisCode(
    concernId: string,
    diagnosisCodeId: string,
    txn: Transaction,
  ): Promise<Concern> {
    return ConcernDiagnosisCode.delete(concernId, diagnosisCodeId, txn);
  }

  static modifyEager(query: QueryBuilder<Concern>): QueryBuilder<Concern> {
    return query
      .eager(EAGER_QUERY, {
        orderByOrder: (builder: any) => {
          builder.orderBy('createdAt', 'desc');
        },
      })
      .modifyEager('diagnosisCodes', builder => {
        builder.where('concern_diagnosis_code.deletedAt', null);
      });
  }
}
/* tslint:enable:member-ordering */
