import React from 'react';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import styles from './css/patient-list.css';
import PatientWithTasksListItem from './patient-with-tasks-list-item';

interface IProps {
  patients: FullPatientForDashboardFragment[];
  pageNumber: number;
  pageSize: number;
}

interface IState {
  selectedPatientId: string | null;
}

class PatientWithTasksList extends React.Component<IProps, IState> {
  state = { selectedPatientId: null };

  componentWillReceiveProps(nextProps: IProps) {
    const { pageNumber, pageSize } = this.props;
    // if changing page number or page size, ensure no patient is selected
    if (nextProps.pageNumber !== pageNumber || nextProps.pageSize !== pageSize) {
      this.setState({ selectedPatientId: null });
    }
  }

  toggleSelectedPatient = (selectedPatientId: string): void => {
    if (this.state.selectedPatientId === selectedPatientId) {
      this.setState({ selectedPatientId: null });
    } else {
      this.setState({ selectedPatientId });
    }
  };

  render(): JSX.Element {
    const { patients } = this.props;
    const { selectedPatientId } = this.state;

    const renderedPatients = patients.map(patient => (
      <PatientWithTasksListItem
        key={patient.id}
        patient={patient}
        selectedPatientId={selectedPatientId}
        toggleSelectedPatient={this.toggleSelectedPatient}
      />
    ));

    return <div className={styles.list}>{renderedPatients}</div>;
  }
}

export default PatientWithTasksList;
