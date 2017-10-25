import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/risk-areas.css';

interface IProps {
  onRetryClick: () => any;
  loading?: boolean;
  error?: string;
}

const buttonStyles = classNames(styles.invertedButton, styles.riskAreasErrorButton);

export const RiskAreasLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, loading, onRetryClick } = props;

  if (error) {
    return (
      <div className={styles.riskAreasError}>
        <div className={styles.riskAreasErrorIcon} />
        <div className={styles.riskAreasErrorLabel}>Unable to load risk areas</div>
        <div className={styles.riskAreasErrorSubheading}>
          Sorry, something went wrong. Please try reloading this section again.
        </div>
        <div className={buttonStyles} onClick={onRetryClick}>
          Try again
        </div>
      </div>
    );
  } else if (loading) {
    return <div className={styles.riskAreasLoading}>Loading...</div>;
  }

  return <div />;
};
