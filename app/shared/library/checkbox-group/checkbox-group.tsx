import React from 'react';
import Text from '../text/text';
import styles from './css/checkbox-group.css';

interface IProps {
  children?: any;
  name?: string;
  errorMessageId?: string;
  hasError?: boolean;
}

const CheckboxGroup: React.StatelessComponent<IProps> = (props: IProps) => {
  const { children, name, errorMessageId, hasError } = props;

  const errorMessage = hasError ? <Text messageId={errorMessageId} color="red" /> : null;
  return (
    <React.Fragment>
      <form className={styles.container} name={name}>
        {children}
      </form>
      {errorMessage}
    </React.Fragment>
  );
};

export default CheckboxGroup;
