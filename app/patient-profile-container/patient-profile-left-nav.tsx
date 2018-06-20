import React from 'react';
import { FullPatientForProfile } from '../graphql/types';
import styles from './css/patient-profile-left-nav.css';
import LeftNavWidget from './left-nav-widget/left-nav-widget';
import LeftNav from './left-nav/left-nav';

interface IProps {
  patient: FullPatientForProfile | null;
  patientId: string;
  glassBreakId: string | null;
}

const PatientProfileLeftNav: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient, patientId, glassBreakId } = props;

  return (
    <div className={styles.leftPane}>
      <LeftNav patient={patient} />
      <LeftNavWidget patientId={patientId} glassBreakId={glassBreakId} />
    </div>
  );
};

export default PatientProfileLeftNav;
