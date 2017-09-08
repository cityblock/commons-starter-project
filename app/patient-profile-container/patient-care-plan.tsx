import * as React from 'react';
import { ICarePlan } from 'schema';
import { FullPatientConcernFragment } from '../graphql/types';
import * as styles from './css/patient-care-plan.css';
import PatientConcern from './patient-concern';

export type ICarePlanDisplayTypes = 'inactive' | 'active';

export interface IProps {
  loading?: boolean;
  routeBase: string;
  patientId: string;
  carePlan?: ICarePlan;
  displayType?: ICarePlanDisplayTypes;
}

export interface IState {
  selectedPatientConcernId?: string;
}

export default class PatientCarePlan extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.renderCarePlan = this.renderCarePlan.bind(this);
    this.onClickPatientConcern = this.onClickPatientConcern.bind(this);

    this.state = { selectedPatientConcernId: undefined };
  }

  onClickPatientConcern(patientConcernId: string) {
    const { selectedPatientConcernId } = this.state;

    if (patientConcernId === selectedPatientConcernId) {
      this.setState(() => ({ selectedPatientConcernId: undefined }));
    } else {
      this.setState(() => ({ selectedPatientConcernId: patientConcernId }));
    }
  }

  renderCarePlan() {
    const { loading, carePlan, displayType } = this.props;
    const { selectedPatientConcernId } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!carePlan) {
      return null;
    }

    let patientConcerns: FullPatientConcernFragment[] = [];

    if (displayType === 'active') {
      patientConcerns = carePlan.concerns.filter(patientConcern => !!patientConcern.startedAt);
    } else {
      patientConcerns = carePlan.concerns.filter(patientConcern => !patientConcern.startedAt);
    }

    return patientConcerns.map((patientConcern, index) => {
      let selected: boolean = false;

      if (index === 0 && selectedPatientConcernId === undefined) {
        selected = true;
      } else {
        selected = selectedPatientConcernId === patientConcern.id;
      }

      return (
        <PatientConcern
          key={patientConcern.id}
          selected={selected}
          patientConcern={patientConcern}
          onClick={this.onClickPatientConcern} />
      );
    });
  }

  render() {
    return (
      <div className={styles.carePlan}>
        {this.renderCarePlan()}
      </div>
    );
  }
}
