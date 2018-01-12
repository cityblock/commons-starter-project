import * as React from 'react';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import * as styles from './css/patient-list.css';
import PatientListItem from './patient-list-item';

interface IProps {
  patients: FullPatientForDashboardFragment[];
}

const PatientList: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patients } = props;

  const renderedPatients = patients.map(patient => (
    <PatientListItem key={patient.id} patient={patient} />
  ));

  return <div className={styles.list}>{renderedPatients}</div>;
};

export default PatientList;
