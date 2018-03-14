import * as React from 'react';
import { FullPatientForProfileFragment } from '../graphql/types';
import * as styles from './css/patient-profile-left-nav.css';
import LeftNavWidget from './left-nav-widget/left-nav-widget';
import LeftNav from './left-nav/left-nav';

interface IProps {
  patient: FullPatientForProfileFragment | null;
  patientId: string;
  glassBreakId: string | null;
}

// TODO: Deprecate old left nav info, medications, and patient problem list
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
