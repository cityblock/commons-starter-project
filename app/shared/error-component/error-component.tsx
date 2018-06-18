import { ApolloError } from 'apollo-client';
import React from 'react';
import Icon from '../library/icon/icon';
import styles from './css/error-component.css';

interface IProps {
  error?: ApolloError;
  errorMessage?: string;
}

export const ErrorComponent: React.StatelessComponent<IProps> = (props: IProps) => {
  const { error, errorMessage } = props;
  const message = error ? error.message : errorMessage;

  return (
    <div className={styles.container}>
      <Icon name="warning" color="red" className={styles.warningIcon} />
      <div>{message}</div>
    </div>
  );
};

export default ErrorComponent;
