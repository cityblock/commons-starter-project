import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from '../css/components/patient-medication.css';
import { FullPatientMedicationFragment } from '../graphql/types';

interface IProps {
  medication: FullPatientMedicationFragment;
  selected: boolean;
  onClick: (medicationId: number) => any;
}

export default class PatientMedication extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { medication } = this.props;
    const dosage = medication.quantity && medication.quantityUnit ?
      `${medication.quantity} ${medication.quantityUnit}` : 'Not specified';

    const medicationClass = classNames(
      styles.medication,
      { [styles.selected]: this.props.selected },
    );

    const dosageInstructions = medication.dosageInstructions || 'No instructions provided.';

    return (
      <div
        className={medicationClass}
        onClick={() => (this.props.onClick(medication.medicationId))}>
        <div className={styles.medicationRow}>
          <div className={styles.medicationRowTitle}>{medication.name}</div>
          <div className={styles.medicationRowDosage}>{dosage}</div>
        </div>
        <div className={styles.medicationDetails}>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationInstructions}>{dosageInstructions}</div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Prescribed by</div>
            <div className={styles.medicationDetailsInfo}>{medication.source}</div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Prescribed on</div>
            <div className={styles.medicationDetailsInfo}>TBD</div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Refills allowed</div>
            <div className={styles.medicationDetailsInfo}>{medication.refillsAllowed}</div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Renewable</div>
            <div className={styles.medicationDetailsInfo}>
              {medication.renewable ? 'Yes' : 'No'}
            </div>
          </div>
          <div className={styles.medicationDetailsRow}>
            <div className={styles.medicationDetailsTitle}>Status</div>
            <div className={styles.medicationDetailsInfo}>{medication.status}</div>
          </div>
        </div>
      </div>
    );
  }
}
