import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientMedicationsQuery from '../graphql/queries/get-patient-medications.graphql';
import { FullPatientMedicationFragment } from '../graphql/types';
import * as styles from './css/patient-medications.css';
import { MedicationsLoadingError } from './medications-loading-error';
import PatientMedication from './patient-medication';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string;
  patientMedications?: FullPatientMedicationFragment[];
  refetchPatientMedications?: (variables: { patientId: string }) => any;
}

interface IState {
  selectedMedicationId: string | null;
  loading?: boolean;
  error?: string;
}

type allProps = IProps & IGraphqlProps;

class PatientMedications extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    const { loading, error } = props;

    this.onClickMedication = this.onClickMedication.bind(this);
    this.renderPatientMedications = this.renderPatientMedications.bind(this);
    this.renderPatientMedication = this.renderPatientMedication.bind(this);
    this.reloadPatientMedications = this.reloadPatientMedications.bind(this);

    this.state = { selectedMedicationId: null, loading, error };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { loading, error } = nextProps;

    this.setState(() => ({ loading, error }));
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
    const { loading, error } = this.state;

    if (medications.length) {
      return medications.map(this.renderPatientMedication);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMedicationsMessage}>
          <div className={styles.emptyMedicationsLogo} />
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

  async reloadPatientMedications() {
    const { patientId, refetchPatientMedications } = this.props;

    if (refetchPatientMedications) {
      try {
        this.setState(() => ({ loading: true, error: undefined }));
        await refetchPatientMedications({ patientId });
      } catch (err) {
        // TODO: This is redundant. Props will get set by the result of the refetch.
        this.setState(() => ({ loading: false, error: err.message }));
      }
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
          <div className={styles.medicationsHamburger} />
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

export default graphql<IGraphqlProps, IProps, allProps>(patientMedicationsQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    patientMedications: data ? formatPatientMedications((data as any).patientMedications) : null,
    refetchPatientMedications: data ? data.refetch : null,
  }),
})(PatientMedications);
