import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import PatientInfo from './patient-info';
import Phone from './phone';

interface IPatientPhoneOptions {
  phoneId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class PatientPhone extends BaseModel {
  patient!: Patient;
  patientId!: string;
  phone!: Phone;
  phoneId!: string;

  static tableName = 'patient_phone';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', format: 'uuid' },
      phoneId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['phoneId', 'patientId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      phone: {
        relation: Model.BelongsToOneRelation,
        modelClass: Phone,
        join: {
          from: 'patient_phone.phoneId',
          to: 'phone.id',
        },
      },
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_phone.patientId',
          to: 'patient.id',
        },
      },
      patientInfo: {
        relation: Model.BelongsToOneRelation,
        modelClass: PatientInfo,
        join: {
          from: 'patient_phone.patientId',
          to: 'patient_info.patientId',
        },
      },
    };
  }

  static async getAll(patientId: string, txn: Transaction): Promise<Phone[]> {
    return (await PatientPhone.query(txn)
      .where('patientId', patientId)
      .andWhere('deletedAt', null)
      .eager('phone')
      .orderBy('createdAt', 'asc')
      .pluck('phone')) as any;
  }

  static async getPatientIdForPhoneNumber(
    phoneNumber: string,
    txn: Transaction,
    isDeleted?: boolean,
  ): Promise<string | null> {
    const query = isDeleted
      ? PatientPhone.query(txn)
          .innerJoinRelation('phone')
          .where({
            'phone.phoneNumber': phoneNumber,
          })
          .whereNotNull('patient_phone.deletedAt')
      : PatientPhone.query(txn)
          .innerJoinRelation('phone')
          .where({
            'phone.phoneNumber': phoneNumber,
            'phone.deletedAt': null,
            'patient_phone.deletedAt': null,
          });

    const patientId = (await query.pluck('patientId').first()) as any;

    return patientId || null;
  }

  static async create(
    { phoneId, patientId }: IPatientPhoneOptions,
    txn: Transaction,
  ): Promise<Phone[]> {
    const phone = await Phone.get(phoneId, txn);
    const fetchedPatientId = await PatientPhone.getPatientIdForPhoneNumber(phone.phoneNumber, txn);

    if (fetchedPatientId && fetchedPatientId !== patientId) {
      return Promise.reject(
        'Another patient is currently using that number. Please contact us for help.',
      );
    }

    await PatientPhone.query(txn).insert({ patientId, phoneId });

    return this.getAll(patientId, txn);
  }

  static async delete(
    { phoneId, patientId }: IPatientPhoneOptions,
    txn: Transaction,
  ): Promise<Phone[]> {
    await this.query(txn)
      .where('phoneId', phoneId)
      .andWhere('patientId', patientId)
      .andWhere('deletedAt', null)
      .patch({ deletedAt: new Date().toISOString() });
    return this.getAll(patientId, txn);
  }
}
/* tslint:enable:member-ordering */
