import { getSmsMessages, smsMessageCreated } from '../../../graphql/types';

interface ISubscriptionData {
  subscriptionData: {
    data?: {
      smsMessageCreated: smsMessageCreated['smsMessageCreated'];
    };
  };
}

export const leftNavMessagesUpdateQuery = (
  previousResult: getSmsMessages,
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
