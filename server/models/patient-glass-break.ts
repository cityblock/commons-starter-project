import BaseModel from './base-model';

// interface IPatientGlassBreakCreateFields {
//   userId: string;
//   patientId: string;
//   reason: string;
//   note: string | null;
// }

/* tslint:disable:member-ordering */
export default class PatientGlassBreak extends BaseModel {
  userId: string;
  patientId: string;
  reason: string;
  note: string | null;

  static tableName = 'patient_glass_break';
  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      reason: { type: 'string', minLength: 1 }, // cannot be blank
      note: { type: ['string', 'null'], minLength: 1 }, // cannot store empty string
    },
    required: ['userId', 'patientId', 'reason'],
  };
}
/* tslint:enable:member-ordering */
