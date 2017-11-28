import * as classNames from 'classnames';
import * as React from 'react';
import { FullPatientGoalFragment } from '../../graphql/types';
import TaskRow from '../tasks/task-row';
import * as styles from './css/goal.css';
import GoalOptions from './goal-options';

interface IProps {
  goalNumber: number;
  patientGoal: FullPatientGoalFragment;
  selectedTaskId: string;
  optionsOpen: boolean;
  onOptionsToggle: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default class PatientGoal extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderTasks = this.renderTasks.bind(this);
  }

  renderTasks() {
    const { patientGoal, selectedTaskId } = this.props;
    const { patientId, tasks } = patientGoal;

    if (!tasks) {
      return null;
    }

    // don't show tasks that have been completed or deleted
    return tasks
      .filter(task => task && !task.completedAt && !task.deletedAt)
      .map(task => (
        <TaskRow
          key={task.id}
          condensed={true}
          task={task}
          selectedTaskId={selectedTaskId}
          routeBase={`/patients/${patientId}/map/active/tasks`}
        />
      ));
  }

  render() {
    const { patientGoal, goalNumber, selectedTaskId, optionsOpen, onOptionsToggle } = this.props;

    const goalStyles = classNames(styles.patientGoal, {
      [styles.inactive]: !!selectedTaskId,
    });

    return (
      <div className={styles.patientGoalTaskGroup}>
        <div className={goalStyles}>
          <div className={styles.patientGoalHeaderRow}>
            <div className={styles.patientGoalNumber}>{`Goal ${goalNumber}`}</div>
            <GoalOptions open={optionsOpen} onMenuToggle={onOptionsToggle} />
          </div>
          <div className={styles.patientGoalTitle}>{patientGoal.title}</div>
        </div>
        {this.renderTasks()}
      </div>
    );
  }
}
