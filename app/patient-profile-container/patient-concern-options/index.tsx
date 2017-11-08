import * as React from 'react';
import * as styles from '../css/patient-concern-options.css';
import PatientConcernOption from './patient-concern-option';

export const Divider: React.StatelessComponent<{}> = () => <div className={styles.border} />;

const PatientConcernOptions: React.StatelessComponent<{}> = () => (
  <div className={styles.container}>
    <PatientConcernOption label="Add a new goal" icon="add" />
    <Divider />
    <PatientConcernOption label="Share Concern URL" icon="share" />
    <Divider />
    <PatientConcernOption label="Reorder Concerns" icon="reorder" />
    <Divider />
    <PatientConcernOption label="Send to Next Up" icon="nextUp" />
    <Divider />
    <PatientConcernOption label="Edit Concern" icon="edit" />
  </div>
);

PatientConcernOptions.displayName = 'PatientConcernOptions';

export default PatientConcernOptions;
