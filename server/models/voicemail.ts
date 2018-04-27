import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import PhoneCall from './phone-call';

interface IVoicemailCreate {
  phoneCallSid: string;
  duration: number;
  twilioPayload: object;
  twilioCreatedAt: string;
  twilioUpdatedAt: string;
  jobId: string;
}

const EAGER_QUERY = 'phoneCall.[user, patient]';

/* tslint:disable:member-ordering */
export default class Voicemail extends BaseModel {
  id: string;
  phoneCallId: string;
  phoneCall: PhoneCall;
  twilioCreatedAt: string;
  twilioUpdatedAt: string;
  duration: number;
  twilioPayload: object;
  jobId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  static tableName = 'voicemail';

  // Not using for now as user can only access voicemail left for them
  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      phoneCallId: { type: 'string', format: 'uuid' },
      twilioCreatedAt: { type: 'string' },
      twilioUpdatedAt: { type: 'string' },
      duration: { type: 'integer', minimum: 0 },
      twilioPayload: { type: 'json' },
      jobId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: [
      'phoneCallId',
      'duration',
      'twilioPayload',
      'jobId',
      'twilioCreatedAt',
      'twilioUpdatedAt',
    ],
  };

  static get relationMappings(): RelationMappings {
    return {
      phoneCall: {
        relation: Model.BelongsToOneRelation,
        modelClass: PhoneCall,
        join: {
          from: 'voicemail.phoneCallId',
          to: 'phone_call.id',
        },
      },
    };
  }

  static async create(input: IVoicemailCreate, txn: Transaction): Promise<Voicemail> {
    const phoneCall = await PhoneCall.getByCallSid(input.phoneCallSid, txn);

    if (!phoneCall) {
      return Promise.reject(`No such phone call with sid: ${input.phoneCallSid}`);
    }

    const formattedInput = {
      ...input,
      phoneCallId: phoneCall.id,
    };

    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(formattedInput);
  }
}
/* tslint:enable:member-ordering */
