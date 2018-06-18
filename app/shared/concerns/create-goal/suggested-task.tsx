import classNames from 'classnames';
import React from 'react';
import Icon from '../../library/icon/icon';
import styles from './css/suggested-task.css';

interface IProps {
  title: string;
  onClick: () => void;
  isRejected?: boolean;
  className?: string; // optional styles to be applied on top of defaults
}

const SuggestedTask: React.StatelessComponent<IProps> = (props: IProps) => {
  const { title, onClick, isRejected, className } = props;
  const containerStyles = classNames(
    styles.container,
    {
      [styles.rejected]: !!isRejected,
    },
    className,
  );

  return (
    <div onClick={onClick} className={containerStyles}>
      <p>{title}</p>
      <Icon name={isRejected ? 'addCircle' : 'highlightOff'} className={styles.icon} />
    </div>
  );
};

export default SuggestedTask;
