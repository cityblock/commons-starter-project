import * as classNames from 'classnames';
import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import * as styles from '../css/components/patient-medications.css';
import fullPatientMedicationsFragment from '../graphql/fragments/full-patient-medication.graphql';
import patientMedicationsQuery from '../graphql/queries/get-patient-medications.graphql';
import { FullPatientMedicationFragment } from '../graphql/types';
import { MedicationsLoadingError } from './medications-loading-error';
import PatientMedication from './patient-medication';

export interface IProps {
  patientId: string;
  loading?: boolean;
  error?: string;
  patientMedications?: FullPatientMedicationFragment[];
  refetchPatientMedications?: (variables: { patientId: string }) => any;
}

export /**/interface IState {
  selectedMedicationId: string | null;
}

class PatientMedications extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onClickMedication = this.onClickMedication.bind(this);
    this.renderPatientMedications = this.renderPatientMedications.bind(this);
    this.renderPatientMedication = this.renderPatientMedication.bind(this);
    this.reloadPatientMedications = this.reloadPatientMedications.bind(this);

    this.state = {
      selectedMedicationId: null,
    };
  }

  onClickMedication(medicationId: string) {
    this.setState((prevState: IState) => {
      const { selectedMedicationId } = prevState;

      if (medicationId === selectedMedicationId) {
        return { selectedMedicationId: null };
      } else {
        return { selectedMedicationId: medicationId };
      }
    });
  }

  renderPatientMedications(medications: FullPatientMedicationFragment[]) {
    const { loading, error } = this.props;

    if (medications.length) {
      return medications.map(this.renderPatientMedication);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMedicationsMessage}>
          <div className={styles.emptyMedicationsLogo}></div>
          <div className={styles.emptyMedicationsLabel}>No active medications</div>
        </div>
      );
    } else {
      return (
        <MedicationsLoadingError
          error={error}
          loading={loading}
          onRetryClick={this.reloadPatientMedications}
        />
      );
    }
  }

  renderPatientMedication(medication: FullPatientMedicationFragment) {
    const selected = medication.name === this.state.selectedMedicationId;

    return (
      <PatientMedication
        key={medication.name}
        medication={medication}
        selected={selected}
        onClick={this.onClickMedication}
      />
    );
  }

  reloadPatientMedications() {
    const { patientId, refetchPatientMedications } = this.props;

    if (refetchPatientMedications) {
      refetchPatientMedications({ patientId });
    }
  }

  render() {
    const { patientMedications } = this.props;
    const medicationsList = patientMedications || [];
    const medicationsListStyles = classNames(styles.medicationsList, {
      [styles.emptyMedicationsList]: !medicationsList.length,
    });

    return (
      <div className={styles.patientMedications}>
        <div className={styles.medicationsHeader}>
          <div className={styles.medicationsTitle}>Active medications</div>
          <div className={styles.medicationsHamburger}></div>
        </div>
        <div className={medicationsListStyles}>
          {this.renderPatientMedications(medicationsList)}
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

export default graphql(gql(patientMedicationsQuery + fullPatientMedicationsFragment), {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    patientMedications: (data ? formatPatientMedications((data as any).patientMedications) : null),
    refetchPatientMedications: (data ? data.refetch : null),
  }),
})(PatientMedications);
