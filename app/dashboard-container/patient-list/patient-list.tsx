import * as React from 'react';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import * as styles from './css/patient-list.css';
import PatientListItem, { DisplayOptions } from './patient-list-item';

interface IProps {
  patients: FullPatientForDashboardFragment[];
  displayType: DisplayOptions;
}

const PatientList: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patients, displayType } = props;

  const renderedPatients = patients.map(patient => (
    <PatientListItem key={patient.id} patient={patient} displayType={displayType} />
  ));

  return <div className={styles.list}>{renderedPatients}</div>;
};

export default PatientList;
