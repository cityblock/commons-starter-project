import { getSmsMessagesQuery, smsMessageCreatedSubscription } from '../../../graphql/types';

interface ISubscriptionData {
  subscriptionData: {
    data?: {
      smsMessageCreated: smsMessageCreatedSubscription['smsMessageCreated'];
    };
  };
}

export const leftNavMessagesUpdateQuery = (
  previousResult: getSmsMessagesQuery,
  { subscriptionData }: ISubscriptionData,
) => {
  if (!subscriptionData.data) return previousResult;

  const newMessage = subscriptionData.data.smsMessageCreated;
  // ensure we don't double add
  if (!previousResult.smsMessages.edges.find(edge => edge.node.id === newMessage.node.id)) {
    const smsMessages = {
      ...previousResult.smsMessages,
      totalCount: previousResult.smsMessages.totalCount + 1,
      edges: [newMessage, ...previousResult.smsMessages.edges],
    };

    return { smsMessages };
  }

  return previousResult;
};
