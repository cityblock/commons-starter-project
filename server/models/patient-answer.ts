import { transaction, Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import { IPaginatedResults } from '../db';

export interface IPatientAnswerCreateFields {
  answerId: string;
  answerValue: string;
  patientId: string;
  applicable: boolean;
}

/* tslint:disable:member-ordering */
export default class PatientAnswer extends Model {
  id: string;
  answerId: string;
  answerValue: string;
  patientId: string;
  applicable: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = 'patient_answer';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      answerId: { type: 'string' },
      answerValue: { type: 'string' },
      applicable: { type: 'boolean' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    answer: {
      relation: Model.HasOneRelation,
      modelClass: 'answer',
      join: {
        from: 'patient_answer.answerId',
        to: 'answer.id',
      },
    },

    patient: {
      relation: Model.HasOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_answer.patientId',
        to: 'patient.id',
      },
    },
  };

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(patientAnswerId: string): Promise<PatientAnswer> {
    const patientAnswer = await this
      .query()
      .findById(patientAnswerId);

    if (!patientAnswer) {
      return Promise.reject(`No such patientAnswer: ${patientAnswerId}`);
    }
    return patientAnswer;
  }

  static async getForQuestion(questionId: string): Promise<PatientAnswer | null> {
    const patientAnswer = await this
      .query()
      .joinRelation('answer')
      .where('patient_answer.deletedAt', null)
      .andWhere('answer.questionId', questionId);

    if (patientAnswer.length > 1) {
      return Promise.reject(`ERROR: There is more than one answer for ${questionId}`);
    }
    return patientAnswer[0] as PatientAnswer;
  }

  static async getPreviousAnswersForQuestion(
    questionId: string, limit = 5,
  ): Promise<PatientAnswer[]> {
    const patientAnswers: IPaginatedResults<PatientAnswer> = await this
      .query()
      .joinRelation('answer')
      .where('answer.questionId', questionId)
      .whereNotNull('patient_answer.deletedAt')
      .orderBy('patient_answer.createdAt')
      .page(0, limit) as any;

    return patientAnswers.results;
  }

  static async create(input: IPatientAnswerCreateFields): Promise<PatientAnswer> {
    return await transaction(PatientAnswer, async PatientAnswerWithTrasaction => {
      await PatientAnswerWithTrasaction
        .query()
        .where('deletedAt', null)
        .andWhere('patientId', input.patientId)
        .andWhere('answerId', input.answerId)
        .patch({ deletedAt: new Date().toISOString() });

      return await PatientAnswerWithTrasaction.query().insertAndFetch(input);
    });
  }

  static async editApplicable(
    applicable: boolean, patientAnswerId: string,
  ): Promise<PatientAnswer> {
    return await this.query()
      .updateAndFetchById(patientAnswerId, { applicable });
  }

  static async delete(patientAnswerId: string): Promise<PatientAnswer> {
    return await this.query().updateAndFetchById(patientAnswerId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
