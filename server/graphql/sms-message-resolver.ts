import { withFilter } from 'graphql-subscriptions';
import { IRootQueryType } from 'schema';
import { IPaginationOptions } from '../db';
import SmsMessage from '../models/sms-message';
import pubsub from '../subscriptions';
import checkUserPermissions from './shared/permissions-check';
import { formatRelayEdge, IContext } from './shared/utils';

interface IQuery extends IPaginationOptions {
  patientId: string;
}

export async function resolveSmsMessages(
  root: any,
  { patientId, pageNumber, pageSize }: IQuery,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['smsMessages']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET SMS messages between patient ${patientId} and user ${userId}`, 2);

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
}

export async function smsMessageSubscribe(
  root: any,
  query: { patientId: string },
  context: IContext,
) {
  const { permissions, userId, txn, logger } = context;
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, query.patientId);

  // only listen to messages between given patient and user
  logger.log(`SUBSCRIBE SMS messages between patient ${query.patientId} and user ${userId}`, 2);

  return withFilter(
    () => pubsub.asyncIterator('smsMessageCreated'),
    payload => {
      return payload.patientId === query.patientId && payload.userId === userId;
    },
  )(root, query, context);
}
