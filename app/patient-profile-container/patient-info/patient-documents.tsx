import * as React from 'react';
import * as styles from './css/patient-documents.css';

interface IProps {
  patientId: string;
  hasMolst?: boolean | null;
  hasHealthcareProxy?: boolean | null;
}

class PatientDocuments extends React.Component<IProps> {
  render() {
    return (
      <div className={styles.container}>
        Documents
      </div>
    );
  }
}

export default PatientDocuments;
