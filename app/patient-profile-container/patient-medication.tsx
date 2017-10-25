import * as classNames from 'classnames';
import * as React from 'react';
import { FullPatientMedicationFragment } from '../graphql/types';
import * as styles from './css/patient-medication.css';

interface IProps {
  medication: FullPatientMedicationFragment;
  selected: boolean;
  onClick: (medicationId: string) => any;
}

export default class PatientMedication extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  // TODO: replace fallbacks post-demo
  render() {
    const { medication, selected } = this.props;
    const dosage =
      medication.quantity && medication.quantityUnit
        ? `${medication.quantity} ${medication.quantityUnit}`
        : 'Every 8 hours';

    const medicationClass = classNames(styles.medication, { [styles.selected]: selected });

    const dosageInstructions = medication.dosageInstructions || 'No instructions provided.';

    return (
      <div className={medicationClass} onClick={() => this.props.onClick(medication.name)}>
        <div className={styles.medicationRow}>
          <div className={styles.medicationRowTitle}>{medication.name}</div>
          <div>{dosage}</div>
        </div>
        <div className={styles.medicationDetails}>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationInstructions}>{dosageInstructions}</div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Prescribed by</div>
            <div className={styles.medicationDetailsInfo}>TBD</div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Prescribed on</div>
            <div className={styles.medicationDetailsInfo}>{medication.startDate}</div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Refills allowed</div>
            <div className={styles.medicationDetailsInfo}>TBD</div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Renewable</div>
            <div className={styles.medicationDetailsInfo}>TBD</div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Status</div>
            <div className={styles.medicationDetailsInfo}>TBD</div>
          </div>
        </div>
      </div>
    );
  }
}
