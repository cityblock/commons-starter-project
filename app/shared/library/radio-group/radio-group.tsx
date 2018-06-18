import classNames from 'classnames';
import React from 'react';
import styles from './css/radio-group.css';

interface IProps {
  children?: any;
  className?: string;
}

const RadioGroup: React.StatelessComponent<IProps> = (props: IProps) => {
  const { children, className } = props;

  return <form className={classNames(styles.container, className)}>{children}</form>;
};

export default RadioGroup;
