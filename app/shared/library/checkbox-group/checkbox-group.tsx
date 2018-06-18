import React from 'react';
import styles from './css/checkbox-group.css';

interface IProps {
  children?: any;
}

const CheckboxGroup: React.StatelessComponent<IProps> = (props: IProps) => {
  const { children } = props;

  return <form className={styles.container}>{children}</form>;
};

export default CheckboxGroup;
