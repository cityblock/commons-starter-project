import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from '../css/components/patient-scratch-pad.css';

interface IProps {
  saveSuccess: boolean;
  saveError: boolean;
  loadingError?: string;
  reloadScratchPad: () => any;
  resaveScratchPad: () => any;
}

const saveSuccessStyles = classNames(styles.scratchPadStatus, styles.saveSuccess);
const errorStyles = classNames(styles.scratchPadStatus, styles.error);

export const PatientScratchPadStatus: React.StatelessComponent<IProps> = props => {
  const { saveError, saveSuccess, loadingError, reloadScratchPad, resaveScratchPad } = props;

  if (saveSuccess) {
    return (
      <div className={saveSuccessStyles}>
        <div className={styles.saveSuccessLabel}>Note saved</div>
        <div className={styles.saveSuccessIcon}></div>
      </div>
    );
  } else if (saveError) {
    return (
      <div className={errorStyles} onClick={resaveScratchPad}>
        <div className={styles.errorLabel}>
          <span className={styles.errorRedLabel}>Not saved. </span>Click here to try again
        </div>
        <div className={styles.errorIcon}></div>
      </div>
    );
  } else if (loadingError) {
    return (
      <div className={errorStyles} onClick={reloadScratchPad}>
        <div className={styles.errorLabel}>
          <span className={styles.errorRedLabel}>Error loading note. </span>Click here to try again
        </div>
        <div className={styles.errorIcon}></div>
      </div>
    );
  } else {
    return (
      <div className={styles.scratchPadStatus}></div>
    );
  }
};
