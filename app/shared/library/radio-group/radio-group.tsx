import * as React from 'react';
import * as styles from './css/radio-group.css';

interface IProps {
  children?: any;
}

const RadioGroup: React.StatelessComponent<IProps> = (props: IProps) => {
  const { children } = props;

  return <form className={styles.container}>{children}</form>;
};

export default RadioGroup;
