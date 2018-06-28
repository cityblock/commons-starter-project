import classNames from 'classnames';
import React from 'react';
import { FullPatientForDashboard } from '../../graphql/types';
import styles from './css/patient-intake-progress-bar.css';

interface IProps {
  computedPatientStatus: FullPatientForDashboard['computedPatientStatus'];
}

const PatientIntakeProgressBar: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    isCoreIdentityVerified,
    isDemographicInfoUpdated,
    isEmergencyContactAdded,
    isAdvancedDirectivesAdded,
    isFullConsentSigned,
    isPhotoAddedOrDeclined,
  } = props.computedPatientStatus;

  return (
    <div className={styles.container}>
      <div className={classNames(styles.box, { [styles.purple]: isCoreIdentityVerified })} />
      <div className={classNames(styles.box, { [styles.purple]: isDemographicInfoUpdated })} />
      <div className={classNames(styles.box, { [styles.purple]: isEmergencyContactAdded })} />
      <div className={classNames(styles.box, { [styles.purple]: isAdvancedDirectivesAdded })} />
      <div className={classNames(styles.box, { [styles.purple]: isFullConsentSigned })} />
      <div className={classNames(styles.box, { [styles.purple]: isPhotoAddedOrDeclined })} />
    </div>
  );
};

export default PatientIntakeProgressBar;
