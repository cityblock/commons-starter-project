import * as express from 'express';
import * as kue from 'kue';
import { createRedisClient } from '../../lib/redis';

const queue = kue.createQueue({ redis: createRedisClient() });

// TODO: These typings need fixing. Likely going to want to type the whole message
export interface IComputedFieldMessageData {
  patientId: string;
  slug: string;
  value: string | number | boolean;
  jobId: string;
}

export interface IMemberAttributionMessageDataExternalIds {
  [key: string]: Array<{
    externalId: string;
  }>;
}

export interface IMemberAttributionMessageData {
  patientId: string;
  cityblockId: string;
  memberId: string;
  gender: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  ssn: string;
  dob: string;
  medicareId: string | null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  race: string;
  ethnicity: string;
  language: string;
  nmi: string;
  maritalStatus: string;
  jobId: string;
  externalIds: IMemberAttributionMessageDataExternalIds;
}

export type SchedulingEventType =
  | 'New'
  | 'Reschedule'
  | 'Modification'
  | 'Cancel'
  | 'NoShow'
  | 'AvailableSlots'
  | 'AvailableSlotsResponse'
  | 'Booked'
  | 'BookedResponse';
export type SchedulingStatusType = 'Scheduled';

export interface IProvider {
  id?: string | null;
  idType?: string | null;
  credentials?: string[] | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface IDiagnosis {
  code?: string | null;
  codeset?: string | null;
  name?: string | null;
  diagnosisType?: string | null;
}

export interface ISchedulingMessageData {
  patientId: string;
  eventType: SchedulingEventType;
  transmissionId: number;
  visitId: string;
  dateTime: string;
  duration: number;
  status: SchedulingStatusType;
  reason?: string | null;
  cancelReason?: string | null;
  instructions?: string[] | null;
  facility?: string | null;
  facilityType?: string | null;
  facilityDepartment?: string | null;
  facilityRoom?: string | null;
  provider?: IProvider;
  attendingProvider?: IProvider;
  consultingProvider?: IProvider;
  referringProvider?: IProvider;
  diagnoses?: IDiagnosis[];
}

/* tslint:disable no-console */
export async function pubsubPushHandler(req: express.Request, res: express.Response) {
  const { data, attributes } = req.body.message;
  const { patientId } = data;
  const { topic } = attributes;

  switch (topic) {
    case 'computedField':
      queue
        .create(topic, {
          title: `Handling ${topic} message for patient: ${patientId}`,
          ...data,
        })
        .priority('low')
        .attempts(5)
        .backoff({ type: 'exponential' })
        .save((err: Error) => {
          if (err) {
            console.log(
              `Error enqueuing ${topic} job. patientId: ${patientId}, slug: ${data.slug}, value: ${
                data.value
              }, jobId: ${data.jobId}`,
              err.message,
            );
          }
        });
      return res.sendStatus(200);
    case 'memberAttribution':
      queue
        .create(topic, {
          title: `Handling ${topic} message for patient: ${patientId}`,
          ...data,
        })
        .priority('low')
        .attempts(5)
        .backoff({ type: 'exponential' })
        .save((err: Error) => {
          if (err) {
            console.log(
              `Error enqueuing ${topic} job. patientId: ${patientId}, cityblockId: ${
                data.cityblockId
              }`,
              err.message,
            );
          }
        });
      return res.sendStatus(200);
    case 'scheduling':
      queue
        .create(topic, {
          title: `Handling ${topic} message for patient: ${patientId}`,
          ...data,
        })
        .priority('low')
        .attempts(5)
        .backoff({ type: 'exponential' })
        .save((err: Error) => {
          if (err) {
            console.log(
              `Error enqueuing ${topic} job. patientId: ${patientId}, visitId: ${data.visitId},
                transmissionId: ${data.transmissionId}`,
              err.message,
            );
          }
        });
      return res.sendStatus(200);
    default:
      console.error(`Unknown topic: ${topic}`);
      return res.sendStatus(200);
  }
}
/* tslint:enable no-console */
