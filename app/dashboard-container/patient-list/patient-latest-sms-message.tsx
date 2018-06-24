import { ApolloError } from 'apollo-client';
import { format, isToday } from 'date-fns';
import { capitalize, truncate } from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import smsMessageLatest from '../../graphql/queries/get-sms-message-latest.graphql';
import { getSmsMessageLatest } from '../../graphql/types';
import Text from '../../shared/library/text/text';
import styles from './css/patient-latest-sms-message.css';

export const TIMESTAMP_FORMAT = 'h:mm a';
const MAX_DISPLAY_LENGTH = 50;

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  smsMessage: getSmsMessageLatest['smsMessageLatest'];
}

type allProps = IProps & IGraphqlProps;

export const PatientLatestSmsMessage: React.StatelessComponent<allProps> = (props: allProps) => {
  const { loading, error, smsMessage } = props;

  if (loading || error) {
    return <Text color="gray" messageId="dashboard.loading" size="medium" />;
  }

  if (!smsMessage) return null;

  const formattedTime = format(smsMessage.createdAt, TIMESTAMP_FORMAT);
  const truncatedText = truncate(smsMessage.body, {
    length: MAX_DISPLAY_LENGTH,
    separator: ' ', // break on word
  });

  const dateComponent = isToday(smsMessage.createdAt) ? (
    <Text color="gray" text={formattedTime} size="small" />
  ) : (
    <FormattedRelative value={smsMessage.createdAt} units="day">
      {(formattedDate: string) => (
        <Text color="gray" text={capitalize(formattedDate)} size="small" />
      )}
    </FormattedRelative>
  );

  return (
    <div className={styles.container}>
      <Text color="black" text={truncatedText} size="medium" />
      {dateComponent}
    </div>
  );
};

export default graphql(smsMessageLatest, {
  options: ({ patientId }: IProps) => ({
    variables: { patientId },
    fetchPolicy: 'network-only',
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    smsMessage: data ? (data as any).smsMessageLatest : null,
  }),
})(PatientLatestSmsMessage);
