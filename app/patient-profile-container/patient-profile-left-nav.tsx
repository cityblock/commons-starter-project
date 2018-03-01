import * as React from 'react';
import { ShortPatientFragment } from '../graphql/types';
import CareTeamWidget from './care-team-widget';
import * as styles from './css/patient-profile-left-nav.css';
import PatientLeftNavInfo from './patient-left-nav-info';
import PatientMedications from './patient-medications';
import PatientProblemList from './patient-problem-list';

interface IProps {
  patient?: ShortPatientFragment | null;
  patientId: string;
}

interface IState {
  selectedItem: string | null;
}

type SelectableItem = 'profile' | 'medications' | 'chat';

export default class PatientProfileLeftNav extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { selectedItem: null };
  }

  onClick = (clickedItem: SelectableItem) => {
    const { selectedItem } = this.state;

    if (clickedItem === selectedItem) {
      this.setState({ selectedItem: null });
    } else {
      this.setState({ selectedItem: clickedItem });
    }
  };

  render() {
    const { patient, patientId } = this.props;

    return (
      <div className={styles.leftPane}>
        <PatientLeftNavInfo patientId={patientId} patient={patient} />
        <PatientMedications patientId={patientId} />
        <PatientProblemList patientId={patientId} />
        <CareTeamWidget patientId={patientId} />
      </div>
    );
  }
}
