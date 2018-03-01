import * as React from 'react';
import * as styles from './css/patient-documents.css';
import PatientAdvancedDirectives from './patient-advanced-directives';
import PatientConsents from './patient-consents';

interface IProps {
  patientId: string;
}

class PatientDocuments extends React.Component<IProps> {
  render() {
    const { patientId } = this.props;
    // TODO: Make this conditional such that they only show up when a patient has ADs
    const patientAdvancedDirectives = <PatientAdvancedDirectives patientId={patientId} />;

    return (
      <div className={styles.container}>
        <PatientConsents patientId={patientId} />
        {patientAdvancedDirectives}
      </div>
    );
  }
}

export default PatientDocuments;
