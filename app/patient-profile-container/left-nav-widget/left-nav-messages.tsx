import * as React from 'react';
import { graphql } from 'react-apollo';
import * as smsMessagesQuery from '../../graphql/queries/get-sms-messages.graphql';
import * as smsMessageSubscription from '../../graphql/queries/sms-message-subscription.graphql';
import { getSmsMessagesQuery } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import * as styles from './css/left-nav-messages.css';
import EmptySmsMessages from './empty-sms-messages';
import { isNewDate } from './helpers';
import SmsMessage from './sms-message';
import SmsMessageDate from './sms-message-date';
import { leftNavMessagesUpdateQuery } from './update-queries/left-nav-messages';

const INITIAL_PAGE_SIZE = 50;

export interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  smsMessages: getSmsMessagesQuery['smsMessages'];
  subscribeToMore: ((args: any) => () => void) | null;
}

type allProps = IProps & IGraphqlProps;

export class LeftNavMessages extends React.Component<allProps> {
  private unsubscribe: (() => void) | null;

  componentDidMount(): void {
    if (this.props.subscribeToMore) {
      this.unsubscribe = this.subscribe();
    }
  }

  componentWillUnmount(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = () => {
    if (this.props.subscribeToMore) {
      return this.props.subscribeToMore({
        document: smsMessageSubscription as any,
        variables: { patientId: this.props.patientId },
        updateQuery: leftNavMessagesUpdateQuery,
      });
    }

    return null;
  }

  render(): JSX.Element {
    const { loading, error, smsMessages } = this.props;
    if (loading || error) return <Spinner />;

    const messages: JSX.Element[] = [];
    const { edges } = smsMessages;

    if (!smsMessages.totalCount) return <EmptySmsMessages />;

    edges.forEach((edge, i) => {
      messages.push(<SmsMessage key={edge.node.id} smsMessage={edge.node} />);

      // display the date banner if first SMS or change from last SMS
      // directions are backward since display newest messages at bottom
      if (i === edges.length - 1 || (edges[i + 1] && isNewDate(edge.node, edges[i + 1].node))) {
        messages.push(<SmsMessageDate key={i} date={edge.node.createdAt} />);
      }
    });

    return <div className={styles.container}>{messages}</div>;
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(smsMessagesQuery as any, {
  options: ({ patientId }) => ({
    variables: { patientId, pageNumber: 0, pageSize: INITIAL_PAGE_SIZE },
  }),
  props: ({ data, ownProps }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    smsMessages: data ? (data as any).smsMessages : null,
    subscribeToMore: data ? data.subscribeToMore : null,
  }),
})(LeftNavMessages);
