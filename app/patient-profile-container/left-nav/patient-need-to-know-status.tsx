import classNames from 'classnames';
import React from 'react';
import styles from './css/patient-need-to-know.css';

interface IProps {
  saveSuccess: boolean;
  saveError: boolean;
  loadingError: string | null;
  reloadNeedToKnow: () => any;
  resaveNeedToKnow: () => any;
}

const saveSuccessStyles = classNames(styles.scratchPadStatus, styles.saveSuccess);
const errorStyles = classNames(styles.scratchPadStatus, styles.error);

export const PatientNeedToKnowStatus: React.StatelessComponent<IProps> = props => {
  const { saveError, saveSuccess, loadingError, reloadNeedToKnow, resaveNeedToKnow } = props;

  if (saveSuccess) {
    return (
      <div className={saveSuccessStyles}>
        <div className={styles.saveSuccessLabel}>Note saved</div>
        <div className={styles.saveSuccessIcon} />
      </div>
    );
  } else if (saveError) {
    return (
      <div className={errorStyles} onClick={resaveNeedToKnow}>
        <div className={styles.errorLabel}>
          <span className={styles.errorRedLabel}>Not saved. </span>Click here to try again
        </div>
        <div className={styles.errorIcon} />
      </div>
    );
  } else if (loadingError) {
    return (
      <div className={errorStyles} onClick={reloadNeedToKnow}>
        <div className={styles.errorLabel}>
          <span className={styles.errorRedLabel}>Error loading note. </span>Click here to try again
        </div>
        <div className={styles.errorIcon} />
      </div>
    );
  } else {
    return <div className={styles.scratchPadStatus} />;
  }
};
