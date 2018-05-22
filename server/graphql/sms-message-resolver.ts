import { withFilter } from 'graphql-subscriptions';
import { transaction } from 'objection';
import { Transaction } from 'objection';
import {
  IRootMutationType,
  IRootQueryType,
  ISmsMessageCreateInput,
  SmsMessageDirection,
} from 'schema';
import { IPaginationOptions } from '../db';
import Patient from '../models/patient';
import PatientPhone from '../models/patient-phone';
import SmsMessage from '../models/sms-message';
import User from '../models/user';
import pubsub from '../subscriptions';
import TwilioClient from '../twilio-client';
import checkUserPermissions from './shared/permissions-check';
import { formatRelayEdge, IContext } from './shared/utils';

interface IQuery extends IPaginationOptions {
  patientId: string;
}

interface ILatestQuery {
  patientId: string;
}

interface ISmsMessageCreateOptions {
  input: ISmsMessageCreateInput;
}

export async function resolveSmsMessages(
  root: any,
  { patientId, pageNumber, pageSize }: IQuery,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootQueryType['smsMessages']> {
  return transaction(testTransaction || SmsMessage.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

    logger.log(`GET SMS messages between patient ${patientId} and user ${userId}`);

    const smsMessages = await SmsMessage.getForUserPatient(
      { patientId, userId: userId! },
      { pageNumber, pageSize },
      txn,
    );

    const smsMessageEdges = smsMessages.results.map((message: SmsMessage) =>
      formatRelayEdge(message, message.id),
    );

    const hasPreviousPage = pageNumber !== 0;
    const hasNextPage = (pageNumber + 1) * pageSize < smsMessages.total;

    return {
      edges: smsMessageEdges,
      pageInfo: {
        hasPreviousPage,
        hasNextPage,
      },
      totalCount: smsMessages.total,
    };
  });
}

export async function resolveSmsMessageLatest(
  root: any,
  { patientId }: ILatestQuery,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootQueryType['smsMessageLatest']> {
  return transaction(testTransaction || SmsMessage.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

    logger.log(`GET latest SMS message between patient ${patientId} and user ${userId}`);

    return SmsMessage.getLatestForUserPatient({ userId: userId!, patientId }, txn);
  });
}

export async function smsMessageCreate(
  root: any,
  { input }: ISmsMessageCreateOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootMutationType['smsMessageCreate']> {
  const { patientId, body } = input;
  return transaction(testTransaction || SmsMessage.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientId);

    logger.log(`CREATE SMS messages between patient ${patientId} and user ${userId}`);

    const user = await User.get(userId!, txn);
    if (!user.phone) {
      return Promise.reject(
        'You do not have a phone number registered with Cityblock. Please contact us for help.',
      );
    }

    const patient = await Patient.get(patientId, txn);
    if (!patient.patientInfo.canReceiveTexts) {
      return Promise.reject('This patient has not consented to receive text messages.');
    }

    const patientPhoneNumber = await getPatientPhoneNumber(
      patientId,
      patient.patientInfo.primaryPhoneId,
      userId!,
      txn,
    );

    if (patientPhoneNumber) {
      const twilioClient = TwilioClient.get();

      try {
        // send message from user to patient
        const twilioPayload = await twilioClient.messages.create({
          from: user.phone,
          to: patientPhoneNumber,
          body,
        });

        // store a record of it in the database
        const smsMessage = await SmsMessage.create(
          {
            userId: userId!,
            contactNumber: patientPhoneNumber,
            direction: 'fromUser' as SmsMessageDirection,
            body,
            twilioPayload,
          },
          txn,
        );

        // update the UI via subscription
        // TODO: in future update cache
        pubsub.publish('smsMessageCreated', {
          smsMessageCreated: { node: smsMessage },
          userId,
          patientId,
        });

        return { node: smsMessage } as any;
      } catch (err) {
        // TODO: Better handle failure state
        return Promise.reject(`An error occured: ${err}`);
      }
    }

    return Promise.reject(
      'This patient does not have a phone number set up to receive texts. Please edit their contact information if that is not correct.',
    );
  });
}

export async function smsMessageSubscribe(
  root: any,
  query: { patientId: string },
  context: IContext,
) {
  const { permissions, userId, testTransaction, logger } = context;
  return transaction(testTransaction || SmsMessage.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, query.patientId);

    // only listen to messages between given patient and user
    logger.log(`SUBSCRIBE SMS messages between patient ${query.patientId} and user ${userId}`);

    return withFilter(
      () => pubsub.asyncIterator('smsMessageCreated'),
      payload => {
        return payload.patientId === query.patientId && payload.userId === userId;
      },
    )(root, query, context);
  });
}

const getPatientPhoneNumber = async (
  patientId: string,
  primaryPhoneId: string | null,
  userId: string,
  txn: Transaction,
): Promise<string | null> => {
  const patientPhones = await PatientPhone.getAll(patientId, txn);
  const primaryPhone = patientPhones.find(phone => phone.id === primaryPhoneId);
  const mobilePhone = patientPhones.find(phone => phone.type === 'mobile');

  // if mobile phone is primary, text that number
  if (primaryPhone && primaryPhone.type === 'mobile') {
    return primaryPhone.phoneNumber;
    // otherwise if another mobile number, use that
  } else if (mobilePhone) {
    return mobilePhone.phoneNumber;
  }

  // otherwise no valid number
  return null;
};
