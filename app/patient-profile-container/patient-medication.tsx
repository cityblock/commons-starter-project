import * as React from 'react';
import * as styles from './css/patient-medication.css';
import { IMedication } from './patient-medications';

interface IProps {
  medication: IMedication;
}

export default class PatientMedication extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { medication } = this.props;
    return (
      <div className={styles.medication}>
        <div className={styles.medicationRow}>
          <div className={styles.medicationRowTitle}>{medication.name}</div>
          <div>{medication.dosageInstructions}</div>
        </div>
      </div>
    );
  }
}
