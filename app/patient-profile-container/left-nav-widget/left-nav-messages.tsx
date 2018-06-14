import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientDocumentsByTypeQuery from '../../graphql/queries/get-patient-documents-by-type.graphql';
import * as patientQuery from '../../graphql/queries/get-patient.graphql';
import * as smsMessagesQuery from '../../graphql/queries/get-sms-messages.graphql';
import * as smsMessageSubscription from '../../graphql/queries/sms-message-subscription.graphql';
import {
  getPatientDocumentsByTypeQuery,
  getPatientQuery,
  getSmsMessagesQuery,
} from '../../graphql/types';
import * as styles from './css/left-nav-messages.css';
import SmsMessageCreate from './sms-message-create';
import SmsMessages from './sms-messages';

import { leftNavMessagesUpdateQuery } from './update-queries/left-nav-messages';

const INITIAL_PAGE_SIZE = 50;

export interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  messagesLoading?: boolean;
  messagesError?: string | null;
  patientLoading?: boolean;
  patientError?: string | null;
  documentsLoading?: boolean;
  documentsError?: string | null;
  patient: getPatientQuery['patient'];
  patientDocuments: getPatientDocumentsByTypeQuery['patientDocumentsByType'];
  smsMessages: getSmsMessagesQuery['smsMessages'];
  subscribeToMore: ((args: any) => () => void) | null;
}

type allProps = IProps & IGraphqlProps;

export class LeftNavMessages extends React.Component<allProps> {
  private unsubscribe: (() => void) | null = null;

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
    const {
      patientLoading,
      patientError,
      messagesLoading,
      messagesError,
      smsMessages,
      patient,
      documentsError,
      documentsLoading,
      patientDocuments,
    } = this.props;

    return (
      <div className={styles.container}>
        <SmsMessages loading={messagesLoading} error={messagesError} smsMessages={smsMessages} />
        <SmsMessageCreate
          patient={patient}
          isConsented={!!patientDocuments && !!patientDocuments.length}
          loading={patientLoading || documentsLoading || false}
          error={patientError || documentsError || null}
        />
      </div>
    );
  }
}

export default compose(
  graphql(patientQuery as any, {
    options: ({ patientId }: IProps) => ({
      variables: { patientId },
    }),
    props: ({ data }) => ({
      patientLoading: data ? data.loading : false,
      patientError: data ? data.error : null,
      patient: data ? (data as any).patient : null,
    }),
  }),
  graphql(patientDocumentsByTypeQuery as any, {
    options: ({ patientId }: IProps) => ({
      variables: { patientId, documentType: 'textConsent' },
    }),
    props: ({ data }) => ({
      documentsLoading: data ? data.loading : false,
      documentsError: data ? data.error : null,
      patientDocuments: data ? (data as any).patientDocumentsByType : null,
    }),
  }),
  graphql(smsMessagesQuery as any, {
    options: ({ patientId }: IProps) => ({
      variables: { patientId, pageNumber: 0, pageSize: INITIAL_PAGE_SIZE },
    }),
    props: ({ data, ownProps }) => ({
      messagesLoading: data ? data.loading : false,
      messagesError: data ? data.error : null,
      smsMessages: data ? (data as any).smsMessages : null,
      subscribeToMore: data ? data.subscribeToMore : null,
    }),
  }),
)(LeftNavMessages as any);
