import React from 'react';
import Icon from '../icon/icon';
import Text from '../text/text';
import styles from './css/modal-error.css';

interface IProps {
  error?: string;
  errorMessageId?: string;
}

const ModalError: React.StatelessComponent<IProps> = (props: IProps) => {
  const { errorMessageId, error } = props;

  const errorLabel = errorMessageId ? (
    <Text messageId={errorMessageId} color="white" className={styles.label} size="medium" />
  ) : null;

  const errorBody = error ? (
    <Text text={error} color="white" className={styles.message} size="medium" />
  ) : null;

  return (
    <div className={styles.container}>
      <Icon name="error" color="white" />
      {errorLabel}
      {errorBody}
    </div>
  );
};

export default ModalError;
