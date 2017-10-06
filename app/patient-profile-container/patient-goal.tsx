import * as React from 'react';
import { FormattedDate } from 'react-intl';
import { FullPatientGoalFragment } from '../graphql/types';
import { TaskRow } from '../shared/tasks/task-row';
import * as styles from './css/patient-care-plan.css';

interface IProps {
  goalNumber: number;
  patientGoal: FullPatientGoalFragment;
}

export default class PatientGoal extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderTasks = this.renderTasks.bind(this);
  }

  renderTasks() {
    const { patientGoal } = this.props;
    const { patientId, tasks } = patientGoal;

    if (!tasks) {
      return null;
    }

    return tasks.map(task => (
      <TaskRow
        key={task.id}
        condensed={true}
        task={task}
        selected={false}
        routeBase={`/patients/${patientId}/tasks`}
      />
    ));
  }

  render() {
    const { patientGoal, goalNumber } = this.props;
    return (
      <div className={styles.patientGoalTaskGroup}>
        <div className={styles.patientGoal}>
          <div className={styles.patientGoalHeaderRow}>
            <div className={styles.patientGoalNumber}>{`Goal ${goalNumber}`}</div>
            <div className={styles.patientGoalUpdatedDetails}>
              <div className={styles.patientGoalUpdatedDetailsLabel}>Last update:</div>
              <div className={styles.patientGoalUpdatedDetailsDate}>
                <FormattedDate
                  value={patientGoal.updatedAt}
                  year='numeric'
                  month='short'
                  day='numeric'
                />
              </div>
            </div>
          </div>
          <div className={styles.patientGoalTitle}>{patientGoal.title}</div>
        </div>
        {this.renderTasks()}
      </div>
    );
  }
}
