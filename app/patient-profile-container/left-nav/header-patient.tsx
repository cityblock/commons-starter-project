import * as classNames from 'classnames';
import { capitalize } from 'lodash';
import * as React from 'react';
import { FullPatientForProfileFragment } from '../../graphql/types';
import {
  formatAge,
  formatPatientNameForProfile,
  getPatientStatusColor,
} from '../../shared/helpers/format-helpers';
import PatientPhoto from '../../shared/library/patient-photo/patient-photo';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/header-patient.css';

interface IProps {
  patient: FullPatientForProfileFragment;
  isWidgetOpen: boolean;
}

const LeftNavHeaderPatient: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient, isWidgetOpen } = props;

  const hasUploadedPhoto = !!patient.patientInfo.hasUploadedPhoto;
  const gender = patient.patientInfo.gender;
  const statusColor = getPatientStatusColor(patient.patientState.currentState);
  const patientName = formatPatientNameForProfile(patient);

  const patientInfo = isWidgetOpen ? (
    <h1 className={styles.patientNameOpen}>{patientName}</h1>
  ) : (
    <div className={styles.patient}>
      <SmallText
        text={capitalize(patient.patientState.currentState)}
        color={statusColor}
        size="medium"
        isBold
      />
      <h1 className={styles.patientName}>{patientName}</h1>
      <SmallText
        messageId="patientInfo.age"
        messageValues={{ age: formatAge(patient.dateOfBirth) }}
        size="large"
        color="black"
        isBold
      />
    </div>
  );

  const photoType = isWidgetOpen ? 'square' : 'squareLarge';
  const containerStyles = classNames(styles.container, {
    [styles.containerOpen]: isWidgetOpen,
  });

  return (
    <div className={containerStyles}>
      <PatientPhoto
        patientId={patient.id}
        gender={gender}
        hasUploadedPhoto={hasUploadedPhoto}
        type={photoType}
      />
      {patientInfo}
    </div>
  );
};

export default LeftNavHeaderPatient;
