import * as React from 'react';
import { getSmsMessagesQuery } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import * as styles from './css/sms-messages.css';
import EmptySmsMessages from './empty-sms-messages';
import { isNewDate } from './helpers';
import SmsMessage from './sms-message';
import SmsMessageDate from './sms-message-date';

export interface IProps {
  loading?: boolean;
  error?: string | null;
  smsMessages: getSmsMessagesQuery['smsMessages'];
}

class SmsMessages extends React.Component<IProps> {
  private messagesEnd: HTMLDivElement | null;

  componentDidMount(): void {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps: IProps): void {
    // if messages came in or a new message added, scroll to bottom
    if (
      (!prevProps.smsMessages && this.props.smsMessages) ||
      this.props.smsMessages.totalCount > prevProps.smsMessages.totalCount
    ) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = (): void => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView(true);
    }
  };

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

    return (
      <div className={styles.container}>
        <div ref={div => (this.messagesEnd = div)} />
        {messages}
        <div className={styles.spacer} />
      </div>
    );
  }
}

export default SmsMessages;
