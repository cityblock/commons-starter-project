import * as React from 'react';
import * as styles from './css/patient-documents.css';
import PatientAdvancedDirectives from './patient-advanced-directives';
import PatientConsents from './patient-consents';

interface IProps {
  patientId: string;
  hasMolst?: boolean | null;
  hasHealthcareProxy?: boolean | null;
}

class PatientDocuments extends React.Component<IProps> {
  render() {
    const { patientId, hasMolst, hasHealthcareProxy } = this.props;
    // TODO: Make this conditional such that they only show up when a patient has ADs
    const patientAdvancedDirectives = (
      <PatientAdvancedDirectives
        patientId={patientId}
        hasMolst={hasMolst}
        hasHealthcareProxy={hasHealthcareProxy}
      />
    );

    return (
      <div className={styles.container}>
        <PatientConsents patientId={patientId} />
        {patientAdvancedDirectives}
      </div>
    );
  }
}

export default PatientDocuments;
