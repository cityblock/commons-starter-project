import * as React from 'react';
import * as styles from './css/patient-medications.css';
import PatientMedication from './patient-medication';

interface IProps {
  patientId: string;
}

interface IState {
  loading?: boolean;
  error: string | null;
}

type allProps = IProps;

export interface IMedication {
  id: string;
  name: string;
  dosageInstructions: string;
}

const medications: IMedication[] = [
  {
    id: 'Trazodone',
    name: 'Trazodone',
    dosageInstructions: '25 mg at night',
  },
  {
    id: 'Aspirin',
    name: 'Aspirin',
    dosageInstructions: '81 mg once daily',
  },
  {
    id: 'Lorazepam',
    name: 'Lorazepam',
    dosageInstructions: '0.5 mg twice daily',
  },
  {
    id: 'Fluoxetine',
    name: 'Fluoxetine',
    dosageInstructions: '40 mg daily',
  },
  {
    id: 'Nitroglycerin',
    name: 'Nitroglycerin',
    dosageInstructions: '0.2 mg as needed',
  },
  {
    id: 'Metformin',
    name: 'Metformin',
    dosageInstructions: '850 mg twice daily',
  },
];

class PatientMedications extends React.Component<allProps, IState> {
  renderPatientMedications(meds: IMedication[]) {
    if (meds.length) {
      return meds.map(this.renderPatientMedication);
    } else {
      return null;
    }
  }

  renderPatientMedication(medication: IMedication) {
    return <PatientMedication key={medication.id} medication={medication} />;
  }

  render() {
    return (
      <div className={styles.patientMedications}>
        <div className={styles.medicationsHeader}>
          <div className={styles.medicationsTitle}>Active medications</div>
        </div>
        <div className={styles.medicationsList}>{this.renderPatientMedications(medications)}</div>
      </div>
    );
  }
}

export default PatientMedications;
