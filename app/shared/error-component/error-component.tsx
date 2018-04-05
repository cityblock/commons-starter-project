import { ApolloError } from 'apollo-client';
import * as React from 'react';
import Icon from '../library/icon/icon';
import * as styles from './css/error-component.css';

interface IProps {
  error: ApolloError;
}

export const ErrorComponent: React.StatelessComponent<IProps> = (props: IProps) => {
  const { error } = props;

  return (
    <div className={styles.container}>
      <Icon name="warning" color="red" className={styles.warningIcon} />
      <div>{error.message}</div>
    </div>
  );
};

export default ErrorComponent;
