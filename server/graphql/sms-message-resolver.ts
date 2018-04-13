import { IRootQueryType } from 'schema';
import { IPaginationOptions } from '../db';
import SmsMessage from '../models/sms-message';
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
