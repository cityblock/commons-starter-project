import * as classNames from 'classnames';
import * as React from 'react';
import { FullPatientGoalFragment } from '../../graphql/types';
import TaskRow from '../tasks/task-row';
import CreateTask from './create-task/create-task';
import * as styles from './css/goal.css';
import GoalOptions from './goal-options';
import { isGoalTasksComplete } from './helpers/helpers';

interface IProps {
  goalNumber: number;
  patientGoal: FullPatientGoalFragment;
  selectedTaskId: string;
  concernTitle: string;
  taskIdsWithNotifications?: string[];
}

interface IState {
  createTaskModal: boolean;
}

export default class PatientGoal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { createTaskModal: false };
  }

  setCreateTaskModal = (createTaskModal: boolean): (() => void) => (): void => {
    this.setState(() => ({ createTaskModal }));
  };

  renderTasks() {
    const { patientGoal, selectedTaskId, taskIdsWithNotifications } = this.props;
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
          taskIdsWithNotifications={taskIdsWithNotifications}
        />
      ));
  }

  render() {
    const { patientGoal, concernTitle, goalNumber, selectedTaskId } = this.props;
    const { createTaskModal } = this.state;

    const goalStyles = classNames(styles.patientGoal, {
      [styles.inactive]: !!selectedTaskId,
    });

    return (
      <div className={styles.patientGoalTaskGroup}>
        <CreateTask
          visible={createTaskModal}
          closePopup={this.setCreateTaskModal(false)}
          patientId={patientGoal.patient.id}
          patientGoalId={patientGoal.id}
          goal={patientGoal.title}
          concern={concernTitle}
        />
        <div className={goalStyles}>
          <div className={styles.patientGoalHeaderRow}>
            <div className={styles.patientGoalNumber}>{`Goal ${goalNumber}`}</div>
            <GoalOptions
              patientGoalId={patientGoal && patientGoal.id}
              patientGoalTitle={patientGoal && patientGoal.title}
              addTask={this.setCreateTaskModal(true)}
              taskOpen={!!selectedTaskId}
              canDelete={isGoalTasksComplete(patientGoal)}
            />
          </div>
          <div className={styles.patientGoalTitle}>{patientGoal.title}</div>
        </div>
        {this.renderTasks()}
      </div>
    );
  }
}
