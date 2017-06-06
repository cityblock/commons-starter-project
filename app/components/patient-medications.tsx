import * as React from 'react';
import { graphql } from 'react-apollo';
import * as styles from '../css/components/patient-medications.css';
import { getQuery } from '../graphql/helpers';
import { FullPatientMedicationFragment } from '../graphql/types';
import PatientMedication from './patient-medication';

interface IProps {
  patientId: string;
  loading?: boolean;
  error?: string;
  patientMedications?: FullPatientMedicationFragment[];
}

interface IState {
  selectedMedicationId: number | null;
}

class PatientMedications extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onClickMedication = this.onClickMedication.bind(this);
    this.renderPatientMedication = this.renderPatientMedication.bind(this);

    this.state = {
      selectedMedicationId: null,
    };
  }

  onClickMedication(medicationId: number) {
    this.setState((prevState: IState) => {
      const { selectedMedicationId } = prevState;

      if (medicationId === selectedMedicationId) {
        return { selectedMedicationId: null };
      } else {
        return { selectedMedicationId: medicationId };
      }
    });
  }

  renderPatientMedication(medication: FullPatientMedicationFragment) {
    const selected = medication.medicationId === this.state.selectedMedicationId;

    return (
      <PatientMedication
        key={medication.medicationId}
        medication={medication}
        selected={selected}
        onClick={this.onClickMedication}
      />
    );
  }

  render() {
    const { patientMedications } = this.props;

    return (
      <div className={styles.patientMedications}>
        <div className={styles.medicationsHeader}>
          <div className={styles.medicationsTitle}>Active medications</div>
          <div className={styles.medicationsHamburger}></div>
        </div>
        <div className={styles.medicationsList}>
          {(patientMedications || []).map(this.renderPatientMedication)}
        </div>
      </div>
    );
  }
}

interface IUnformattedPatientMedications {
  medications?: {
    active?: FullPatientMedicationFragment[];
  };
}

const formatPatientMedications = (
  patientMedications: IUnformattedPatientMedications,
): FullPatientMedicationFragment[] => {
  if (patientMedications && patientMedications.medications) {
    return patientMedications.medications.active || [];
  } else {
    return [];
  }
};

const patientMedicationsQuery = getQuery('app/graphql/queries/get-patient-medications.graphql');

export default graphql(patientMedicationsQuery, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    patientMedications: (data ? formatPatientMedications((data as any).patientMedications) : null),
  }),
})(PatientMedications);
