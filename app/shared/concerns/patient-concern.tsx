import * as classNames from 'classnames';
import * as React from 'react';
import { adminTasksConcernTitle } from '../../../server/models/concern';
import { FullPatientConcernFragment } from '../../graphql/types';
import PatientGoal from '../goals/goal';
import PatientConcernStats from './concern-stats/concern-stats';
import * as styles from './css/patient-concern.css';
import PatientConcernOptions from './options-menu/options-menu';

interface IProps {
  patientConcern: FullPatientConcernFragment;
  selected: boolean;
  optionsOpen: boolean;
  onClick: (e?: React.MouseEvent<HTMLDivElement>) => void;
  onOptionsToggle: (e: React.MouseEvent<HTMLDivElement>) => void;
  inactive?: boolean;
  selectedTaskId: string;
  isDragging?: boolean;
}

interface IState {
  optionsDropdownGoalId: string;
}

export interface IPatientConcernStats {
  goalCount: number;
  taskCount: number;
  lastUpdated: string;
}

export class PatientConcern extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { optionsDropdownGoalId: '' };
  }

  componentWillReceiveProps(nextProps: IProps) {
    // close any open goal dropdown menus if concern no longer selected or viewing task
    if (!nextProps.selected || !!nextProps.selectedTaskId) {
      this.setState({ optionsDropdownGoalId: '' });
    }
  }

  onOptionsToggle = (goalId: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    // do nothing if task open as we close task on clicking outside of task
    if (this.props.selectedTaskId) return;

    const { optionsDropdownGoalId } = this.state;

    if (goalId === optionsDropdownGoalId) {
      this.setState({ optionsDropdownGoalId: '' });
    } else {
      this.setState({ optionsDropdownGoalId: goalId });
    }
  };

  getStats() {
    const { patientConcern } = this.props;
    const { patientGoals } = patientConcern;

    const stats: IPatientConcernStats = {
      goalCount: 0,
      taskCount: 0,
      lastUpdated: patientConcern.updatedAt,
    };

    if (patientGoals && patientGoals.length) {
      stats.goalCount = patientGoals.length;

      patientGoals.forEach(patientGoal => {
        const { tasks } = patientGoal;

        const goalLastUpdated = new Date(patientGoal.updatedAt);
        const goalMoreRecentlyUpdated =
          goalLastUpdated.valueOf() > new Date(stats.lastUpdated).valueOf();

        if (goalMoreRecentlyUpdated) {
          stats.lastUpdated = patientGoal.updatedAt;
        }

        if (tasks && tasks.length) {
          stats.taskCount += tasks.length;

          tasks.forEach(task => {
            const taskLastUpdated = new Date(task.updatedAt);
            const taskMoreRecentlyUpdated =
              taskLastUpdated.valueOf() > new Date(stats.lastUpdated).valueOf();

            if (taskMoreRecentlyUpdated) {
              stats.lastUpdated = task.updatedAt;
            }
          });
        }
      });
    }

    return stats;
  }

  renderGoals() {
    const { patientConcern, selectedTaskId } = this.props;
    const { patientGoals } = patientConcern;
    const { optionsDropdownGoalId } = this.state;

    if (!patientGoals) {
      return null;
    }

    return patientGoals.map((patientGoal, index) => (
      <PatientGoal
        key={patientGoal.id}
        patientGoal={patientGoal}
        concernTitle={patientConcern.concern.title}
        goalNumber={index + 1}
        selectedTaskId={selectedTaskId}
        optionsOpen={!!optionsDropdownGoalId && patientGoal.id === optionsDropdownGoalId}
        onOptionsToggle={this.onOptionsToggle(patientGoal.id)}
      />
    ));
  }

  render() {
    const {
      onClick,
      onOptionsToggle,
      patientConcern,
      selected,
      optionsOpen,
      inactive,
      selectedTaskId,
      isDragging,
    } = this.props;
    const { patientGoals, concern } = patientConcern;

    const goalsStyles = classNames(styles.goals, {
      [styles.hidden]: !selected || (!patientGoals || !patientGoals.length),
    });
    const { goalCount, taskCount, lastUpdated } = this.getStats();

    const isInactive = inactive || !!selectedTaskId;
    const isSelected = isDragging || (!selectedTaskId && selected);

    const mainStyles = classNames(styles.main, {
      [styles.inactive]: isInactive && !isSelected,
      [styles.selected]: isSelected,
      [styles.administrative]: concern.title === adminTasksConcernTitle,
    });

    return (
      <div className={styles.container}>
        <div className={mainStyles} onClick={onClick}>
          <div className={styles.row}>
            <h3>{patientConcern.concern.title}</h3>
            <PatientConcernOptions open={optionsOpen} onMenuToggle={onOptionsToggle} />
          </div>
          <PatientConcernStats
            goalCount={goalCount}
            taskCount={taskCount}
            createdAt={patientConcern.createdAt}
            lastUpdated={lastUpdated}
            inactive={!isSelected && isInactive}
          />
        </div>
        <div className={goalsStyles}>{this.renderGoals()}</div>
      </div>
    );
  }
}

export default PatientConcern;
