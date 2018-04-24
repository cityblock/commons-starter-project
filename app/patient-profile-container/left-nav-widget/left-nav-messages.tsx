import * as React from 'react';
import { graphql } from 'react-apollo';
import * as smsMessagesQuery from '../../graphql/queries/get-sms-messages.graphql';
import * as smsMessageSubscription from '../../graphql/queries/sms-message-subscription.graphql';
import { getSmsMessagesQuery } from '../../graphql/types';
import * as styles from './css/left-nav-messages.css';
import SmsMessageCreate from './sms-message-create';
import SmsMessages from './sms-messages';

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
  };

  render(): JSX.Element {
    const { loading, error, smsMessages, patientId } = this.props;

    return (
      <div className={styles.container}>
        <SmsMessages loading={loading} error={error} smsMessages={smsMessages} />
        <SmsMessageCreate patientId={patientId} />
      </div>
    );
  }
}

export default graphql(smsMessagesQuery as any, {
  options: ({ patientId }: IProps) => ({
    variables: { patientId, pageNumber: 0, pageSize: INITIAL_PAGE_SIZE },
  }),
  props: ({ data, ownProps }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    smsMessages: data ? (data as any).smsMessages : null,
    subscribeToMore: data ? data.subscribeToMore : null,
  }),
})(LeftNavMessages as any);
