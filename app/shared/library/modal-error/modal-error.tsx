import * as React from 'react';
import Icon from '../icon/icon';
import SmallText from '../small-text/small-text';
import * as styles from './css/modal-error.css';

interface IProps {
  error?: string;
  errorMessageId?: string;
}

const ModalError: React.StatelessComponent<IProps> = (props: IProps) => {
  const { errorMessageId, error } = props;

  const errorLabel = errorMessageId ? (
    <SmallText messageId={errorMessageId} color="white" className={styles.label} size="medium" />
  ) : null;

  const errorBody = error ? (
    <SmallText text={error} color="white" className={styles.message} size="medium" />
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
