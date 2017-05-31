import * as React from 'react';
import * as styles from '../css/components/error-message.css';

interface IProps {
  text: string;
}

export const ErrorMessage: React.StatelessComponent<IProps> = props => (
  <div>
    <span className={styles.error}>{props.text}</span>
  </div>
);
