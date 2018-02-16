import { toUpper } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';

interface IDiagnosisCodeCreateFields {
  codesetName: string;
  label: string;
  code: string;
  version: string;
}

export type DiagnosisCodeOrderOptions = 'createdAt' | 'label' | 'code';

interface IDiagnosisCodeOrderOptions {
  orderBy: DiagnosisCodeOrderOptions;
  order: 'asc' | 'desc';
}

function getCleanedCode(dirtyCode: string): string {
  return toUpper(dirtyCode.replace(/\s+|\.+/g, '')); // Get rid of '.'s and spaces and upper case
}

/* tslint:disable:member-ordering */
export default class DiagnosisCode extends BaseModel {
  codesetName: string;
  label: string;
  code: string;
  version: string;

  static tableName = 'diagnosis_code';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      codesetName: { type: 'string', minLength: 1 },
      label: { type: 'string', minLength: 1 },
      code: { type: 'string', minLength: 1 },
      version: { type: 'string', minLength: 1 },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['codesetName', 'label', 'code', 'version'],
  };

  static relationMappings: RelationMappings = {
    concerns: {
      relation: Model.ManyToManyRelation,
      modelClass: 'concern',
      join: {
        from: 'diagnosis_code.id',
        through: {
          from: 'concern_diagnosis_code.diagnosisCodeId',
          to: 'concern_diagnosis_code.concernId',
        },
        to: 'concern.id',
      },
    },
  };

  static async get(diagnosisCodeId: string, txn: Transaction): Promise<DiagnosisCode> {
    const diagnosisCode = await this.query(txn).findOne({ id: diagnosisCodeId, deletedAt: null });

    if (!diagnosisCode) {
      return Promise.reject(`No such diagnosis code: ${diagnosisCodeId}`);
    }
    return diagnosisCode;
  }

  static async create(input: IDiagnosisCodeCreateFields, txn: Transaction): Promise<DiagnosisCode> {
    const { codesetName, code, version } = input;
    const cleanedCode = getCleanedCode(code);
    const existingDiagnosisCode = await this.getByCodesetNameAndCodeAndVersion(
      codesetName,
      cleanedCode,
      version,
      txn,
    );

    if (existingDiagnosisCode) {
      return existingDiagnosisCode;
    }

    return this.query(txn).insertAndFetch({ ...input, code: cleanedCode });
  }

  static async getAll(
    { orderBy, order }: IDiagnosisCodeOrderOptions,
    txn: Transaction,
  ): Promise<DiagnosisCode[]> {
    return this.query(txn)
      .where('deletedAt', null)
      .orderBy(orderBy, order);
  }

  static async getByCodesetNameAndCodeAndVersion(
    codesetName: string,
    code: string,
    version: string,
    txn: Transaction,
  ): Promise<DiagnosisCode | null> {
    const diagnosisCode = await this.query(txn).findOne({
      codesetName,
      code: getCleanedCode(code),
      version,
      deletedAt: null,
    });

    if (!diagnosisCode) {
      return null;
    }

    return diagnosisCode;
  }

  static async delete(diagnosisCodeId: string, txn: Transaction): Promise<DiagnosisCode> {
    await this.query(txn)
      .where({ id: diagnosisCodeId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const diagnosisCode = await this.query(txn).findById(diagnosisCodeId);

    if (!diagnosisCode) {
      return Promise.reject(`No such diagnosisCode: ${diagnosisCodeId}`);
    }

    return diagnosisCode;
  }
}
/* tslint:enable:member-ordering */
