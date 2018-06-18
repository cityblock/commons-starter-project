import classNames from 'classnames';
import React from 'react';
import loadingStyles from '../../../shared/css/loading-spinner.css';
import styles from './css/spinner.css';

interface IProps {
  className?: string;
}

const Spinner: React.StatelessComponent<IProps> = ({ className }) => {
  const spinnerStyles = classNames(loadingStyles.loadingSpinner, className);

  return (
    <div className={styles.container}>
      <div className={spinnerStyles} />
    </div>
  );
};

export default Spinner;
