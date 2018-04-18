import { format, isToday } from 'date-fns';
import { capitalize, truncate } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import * as smsMessageLatestQuery from '../../graphql/queries/get-sms-message-latest.graphql';
import { getSmsMessageLatestQuery } from '../../graphql/types';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/patient-latest-sms-message.css';

export const TIMESTAMP_FORMAT = 'h:mm a';
const MAX_DISPLAY_LENGTH = 50;

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  smsMessage: getSmsMessageLatestQuery['smsMessageLatest'];
}

type allProps = IProps & IGraphqlProps;

export const PatientLatestSmsMessage: React.StatelessComponent<allProps> = (props: allProps) => {
  const { loading, error, smsMessage } = props;

  if (loading || error) {
    return <SmallText color="gray" messageId="dashboard.loading" size="medium" />;
  }

  if (!smsMessage) return null;

  const formattedTime = format(smsMessage.createdAt, TIMESTAMP_FORMAT);
  const truncatedText = truncate(smsMessage.body, {
    length: MAX_DISPLAY_LENGTH,
    separator: ' ', // break on word
  });

  const dateComponent = isToday(smsMessage.createdAt) ? (
    <SmallText color="gray" text={formattedTime} size="small" />
  ) : (
    <FormattedRelative value={smsMessage.createdAt} units="day">
      {(formattedDate: string) => (
        <SmallText color="gray" text={capitalize(formattedDate)} size="small" />
      )}
    </FormattedRelative>
  );

  return (
    <div className={styles.container}>
      <SmallText color="black" text={truncatedText} size="medium" />
      {dateComponent}
    </div>
  );
};

export default graphql<IGraphqlProps, IProps, allProps>(smsMessageLatestQuery as any, {
  options: ({ patientId }) => ({
    variables: { patientId },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    smsMessage: data ? (data as any).smsMessageLatest : null,
  }),
})(PatientLatestSmsMessage);