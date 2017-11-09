import * as React from 'react';
import { ICarePlan } from 'schema';
import PatientConcerns from '../shared/concerns';
import TextDivider from '../shared/text-divider';
import * as styles from './css/patient-care-plan.css';

interface IProps {
  loading?: boolean;
  routeBase: string;
  patientId: string;
  carePlan?: ICarePlan;
}

interface IState {
  selectedPatientConcernId?: string;
  optionsDropdownConcernId?: string;
}

export default class PatientCarePlan extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedPatientConcernId: undefined,
      optionsDropdownConcernId: undefined,
    };
  }

  onClickPatientConcern = (patientConcernId: string) => {
    const { selectedPatientConcernId } = this.state;

    if (patientConcernId === selectedPatientConcernId) {
      this.setState(() => ({ selectedPatientConcernId: undefined }));
    } else {
      this.setState(() => ({ selectedPatientConcernId: patientConcernId }));
    }
  }

  onOptionsToggle = (patientConcernId: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevents closing of selected concern if unselected concern options toggle clicked
    e.stopPropagation();
    const { optionsDropdownConcernId } = this.state;

    if (patientConcernId === optionsDropdownConcernId) {
      this.setState(() => ({ optionsDropdownConcernId: undefined }));
    } else {
      this.setState(() => ({ optionsDropdownConcernId: patientConcernId }));
    }
  }

  renderCarePlan() {
    const { loading, carePlan } = this.props;
    const { selectedPatientConcernId, optionsDropdownConcernId } = this.state;

    if (loading) {
      return (
        <div className={styles.emptyCarePlanSuggestionsContainer}>
          <div className={styles.loadingLabel}>Loading...</div>
        </div>
      );
    }

    if (!carePlan) {
      return null;
    }

    const activeConcerns = carePlan.concerns.filter(
      patientConcern => !!patientConcern.startedAt,
    ) as any;
    const inactiveConcerns = carePlan.concerns.filter(
      patientConcern => !patientConcern.startedAt,
    ) as any;

    return (
      <div>
        <PatientConcerns
          concerns={activeConcerns}
          selectedPatientConcernId={selectedPatientConcernId}
          optionsDropdownConcernId={optionsDropdownConcernId}
          onClick={this.onClickPatientConcern}
          onOptionsToggle={this.onOptionsToggle}
        />
        <TextDivider label="Next Up" />
        <PatientConcerns
          concerns={inactiveConcerns}
          inactive={true}
          selectedPatientConcernId={selectedPatientConcernId}
          optionsDropdownConcernId={optionsDropdownConcernId}
          onClick={this.onClickPatientConcern}
          onOptionsToggle={this.onOptionsToggle}
        />
      </div>
    );
  }

  render() {
    return <div className={styles.carePlan}>{this.renderCarePlan()}</div>;
  }
}
