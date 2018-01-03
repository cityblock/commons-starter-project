import * as React from 'react';
import { FullPatientMedicationFragment } from '../graphql/types';
import * as styles from './css/patient-medication.css';

interface IProps {
  medication: FullPatientMedicationFragment;
}

export default class PatientMedication extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { medication } = this.props;
    const dosage =
      medication.quantity && medication.quantityUnit
        ? `${medication.quantity} ${medication.quantityUnit}`
        : 'Every 8 hours';
    return (
      <div className={styles.medication}>
        <div className={styles.medicationRow}>
          <div className={styles.medicationRowTitle}>{medication.name}</div>
          <div>{dosage}</div>
        </div>
      </div>
    );
  }
}
