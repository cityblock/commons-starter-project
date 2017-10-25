import * as classNames from 'classnames';
import * as React from 'react';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as styles from './css/new-patient-encounter.css';

interface IProps {
  onClick: () => any;
  loading: boolean;
  error?: string;
}

export default class NewPatientEncounterLoadingError extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { error, loading, onClick } = this.props;

    const displayClass = classNames(styles.newEncounterLoadingError, {
      [styles.newEncounterLoadingErrorError]: !!error,
      [styles.newEncounterLoadingErrorLoading]: loading,
    });

    const spinnerStyles = classNames(loadingStyles.loadingSpinner, styles.spinner);
    const buttonStyles = classNames(styles.invertedButton, styles.newEncounterSavingErrorButton);

    return (
      <div className={displayClass}>
        <div className={styles.newEncounterSavingSpinner}>
          <div className={spinnerStyles} />
          <div className={loadingStyles.loadingText}>Saving</div>
        </div>
        <div className={styles.newEncounterSavingError}>
          <div className={styles.newEncounterSavingErrorIcon} />
          <div className={styles.newEncounterSavingErrorLabel}>Unable to save encounter</div>
          <div className={styles.newEncounterSavingErrorSubtext}>
            Sorry, something went wrong. Please try saving this encounter again.
          </div>
          <div className={buttonStyles} onClick={onClick}>
            Try again
          </div>
        </div>
      </div>
    );
  }
}
