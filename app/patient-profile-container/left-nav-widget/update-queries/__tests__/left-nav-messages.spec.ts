import { smsMessage1, smsMessage2 } from '../../../../shared/util/test-data';
import { leftNavMessagesUpdateQuery } from '../left-nav-messages';

describe('Left Navigation Widget Update Queries', () => {
  describe('leftNavMessagesUpdateQuery', () => {
    const previousResult = {
      smsMessages: {
        edges: [
          {
            node: smsMessage1,
          },
        ],
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
        },
        totalCount: 1,
      },
    };
    const newResult = {
      smsMessages: {
        edges: [
          {
            node: smsMessage2,
          },
          {
            node: smsMessage1,
          },
        ],
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
        },
        totalCount: 2,
      },
    };

    it('returns previous result if no data', () => {
      const subscriptionData = {
        subscriptionData: {},
      };
      const result = leftNavMessagesUpdateQuery(previousResult, subscriptionData);

      expect(result).toEqual(previousResult);
    });

    it('adds new message to previous result', () => {
      const subscriptionData = {
        subscriptionData: {
          data: {
            smsMessageCreated: {
              node: smsMessage2,
            },
          },
        },
      };
      const result = leftNavMessagesUpdateQuery(previousResult, subscriptionData);

      expect(result).toEqual(newResult);
    });

    it('does not double add message if already added', () => {
      const subscriptionData = {
        subscriptionData: {
          data: {
            smsMessageCreated: {
              node: smsMessage2,
            },
          },
        },
      };
      const result = leftNavMessagesUpdateQuery(previousResult, subscriptionData);

      expect(result).toEqual(newResult);
    });
  });
});
