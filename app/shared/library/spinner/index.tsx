import * as classNames from 'classnames';
import * as React from 'react';
import * as loadingStyles from '../../../shared/css/loading-spinner.css';
import * as styles from './css/index.css';

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
