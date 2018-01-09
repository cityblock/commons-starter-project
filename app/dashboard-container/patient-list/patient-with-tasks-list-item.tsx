import * as React from 'react';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import PatientListItem from './patient-list-item';

interface IProps {
  patient: FullPatientForDashboardFragment;
}

class PatientWithTaskListItem extends React.Component<IProps> {
  render(): JSX.Element {
    const { patient } = this.props;

    return <PatientListItem patient={patient} taskView={true} />;
  }
}

export default PatientWithTaskListItem;
