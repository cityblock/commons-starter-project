import * as React from 'react';
import { ICarePlan, IPatientConcern } from 'schema';
import * as styles from './css/patient-care-plan.css';

export type ICarePlanDisplayTypes = 'inactive' | 'active';

export interface IProps {
  routeBase: string;
  patientId: string;
  carePlan?: ICarePlan;
  displayType?: ICarePlanDisplayTypes;
}

export default class PatientCarePlan extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderCarePlan = this.renderCarePlan.bind(this);
  }

  renderCarePlan() {
    const { carePlan, displayType } = this.props;

    if (!carePlan) {
      return null;
    }

    let patientConcerns: IPatientConcern[] = [];

    if (displayType === 'active') {
      patientConcerns = carePlan.concerns.filter(patientConcern => !!patientConcern.startedAt);
    } else {
      patientConcerns = carePlan.concerns.filter(patientConcern => !patientConcern.startedAt);
    }

    return patientConcerns.map(patientConcern => {
      const goalsHtml = patientConcern.patientGoals.map(patientGoal => {
        const tasksHtml = patientGoal.tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ));

        return (
          <li key={patientGoal.id}>
            {patientGoal.title}
            <ul>{tasksHtml}</ul>
          </li>
        );
      });

      return (
        <div key={patientConcern.id}>
          <div>{patientConcern.concern.title}</div>
          <div>{goalsHtml}</div>
        </div>
      );
    });
  }

  render() {
    const { displayType } = this.props;

    return (
      <div className={styles.carePlanSuggestions}>
        {`${displayType || 'active'} care plan`}
        {this.renderCarePlan()}
      </div>
    );
  }
}
