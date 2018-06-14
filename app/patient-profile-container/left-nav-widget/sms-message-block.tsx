import * as classNames from 'classnames';
import * as React from 'react';
import { getPatientQuery } from '../../graphql/types';
import Text from '../../shared/library/text/text';
import * as styles from './css/sms-message-block.css';

interface IProps {
  patient: getPatientQuery['patient'];
  isConsented: boolean;
  loading: boolean;
  error: string | null;
}

const smsMessageBlock = (props: IProps): JSX.Element | null => {
  const { patient, isConsented, loading, error } = props;

  let messageId = '';

  if (loading) {
    messageId = 'messages.loading';
  } else if (error) {
    messageId = 'messages.errorLoading';
  } else if (!isConsented) {
    messageId = 'messages.noConsent';
  }

  if (messageId) {
    return (
      <div className={classNames(styles.container, styles.flex)}>
        <Text messageId={messageId} color="black" size="large" />
      </div>
    );
  }

  if (!patient.patientInfo.primaryPhone) {
    return (
      <div className={styles.container}>
        <Text
          messageId="messages.noPhone"
          color="black"
          size="large"
          isBold
          className={styles.inline}
        />
        <Text
          messageId="messages.noPhoneDetail"
          color="black"
          size="large"
          className={styles.inline}
        />
      </div>
    );
  }

  return null;
};

export default smsMessageBlock;
