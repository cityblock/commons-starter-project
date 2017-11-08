import * as React from 'react';
import { ICarePlan } from 'schema';
import { FullPatientConcernFragment } from '../graphql/types';
import * as styles from './css/patient-care-plan.css';
import PatientConcern from './patient-concern';

export type ICarePlanDisplayTypes = 'inactive' | 'active';

interface IProps {
  loading?: boolean;
  routeBase: string;
  patientId: string;
  carePlan?: ICarePlan;
  displayType?: ICarePlanDisplayTypes;
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
    const { loading, carePlan, displayType } = this.props;
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

    let patientConcerns: FullPatientConcernFragment[] = [];

    if (displayType === 'inactive') {
      // 'as any' addresses iirrelevant enum type inconsistency
      patientConcerns = carePlan.concerns.filter(
        patientConcern => !patientConcern.startedAt,
      ) as any;
    } else {
      patientConcerns = carePlan.concerns.filter(
        patientConcern => !!patientConcern.startedAt,
      ) as any;
    }

    if (!patientConcerns.length) {
      return (
        <div className={styles.emptyCarePlanSuggestionsContainer}>
          <div className={styles.emptyCarePlanSuggestionsLogo} />
          <div className={styles.emptyCarePlanSuggestionsLabel}>
            {`No ${displayType} concerns or goals for this patient`}
          </div>
          <div className={styles.emptyCarePlanSuggestionsSubtext}>
            New concerns and goals will be displayed here as they are added
          </div>
        </div>
      );
    }

    return patientConcerns.map((patientConcern, index) => {
      const selected =
        index === 0 && selectedPatientConcernId === undefined
          ? true
          : selectedPatientConcernId === patientConcern.id;
      const optionsOpen = optionsDropdownConcernId === patientConcern.id;

      return (
        <PatientConcern
          key={patientConcern.id}
          selected={selected}
          patientConcern={patientConcern}
          onClick={this.onClickPatientConcern}
          onOptionsToggle={this.onOptionsToggle}
          optionsOpen={optionsOpen}
        />
      );
    });
  }

  render() {
    return <div className={styles.carePlan}>{this.renderCarePlan()}</div>;
  }
}
