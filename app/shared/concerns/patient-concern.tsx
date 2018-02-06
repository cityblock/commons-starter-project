import * as classNames from 'classnames';
import * as React from 'react';
import { adminTasksConcernTitle } from '../../../server/lib/consts';
import { FullPatientConcernFragment } from '../../graphql/types';
import { isCBOReferralRequiringActionForUser } from '../../shared/task/helpers/helpers';
import { checkIfDueSoon } from '../../shared/util/due-date';
import PatientGoal from '../goals/goal';
import PatientConcernStats from './concern-stats/concern-stats';
import * as styles from './css/patient-concern.css';
import PatientConcernOptions from './options-menu/options-menu';

interface IProps {
  patientConcern: FullPatientConcernFragment;
  selected: boolean;
  onClick: (e?: React.MouseEvent<HTMLDivElement>) => void;
  inactive?: boolean;
  selectedTaskId: string;
  isDragging?: boolean;
  taskIdsWithNotifications?: string[];
  currentUserId: string;
}

export interface IPatientConcernStats {
  goalCount: number;
  taskCount: number;
  lastUpdated: string;
  hasBadge: boolean;
}

export class PatientConcern extends React.Component<IProps, {}> {
  getStats() {
    const { patientConcern, taskIdsWithNotifications, currentUserId } = this.props;
    const { patientGoals } = patientConcern;

    const stats: IPatientConcernStats = {
      goalCount: 0,
      taskCount: 0,
      lastUpdated: patientConcern.updatedAt,
      hasBadge: false,
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

            const dueSoon = checkIfDueSoon(task.dueAt);
            const isCBOReferralRequiringAction = isCBOReferralRequiringActionForUser(
              task,
              currentUserId,
            );

            const hasNotification =
              !!taskIdsWithNotifications && taskIdsWithNotifications.includes(task.id);
            stats.hasBadge =
              stats.hasBadge || dueSoon || hasNotification || isCBOReferralRequiringAction;
          });
        }
      });
    }

    return stats;
  }

  renderGoals() {
    const { patientConcern, selectedTaskId, taskIdsWithNotifications, currentUserId } = this.props;
    const { patientGoals } = patientConcern;

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
        taskIdsWithNotifications={taskIdsWithNotifications}
        currentUserId={currentUserId}
      />
    ));
  }

  getGoalSuggestionTemplateIds(): string[] {
    const goalTemplateIds: string[] = [];
    const { patientConcern } = this.props;

    if (patientConcern) {
      (patientConcern.patientGoals || []).forEach(goal => {
        if (goal.goalSuggestionTemplateId) goalTemplateIds.push(goal.goalSuggestionTemplateId);
      });
    }

    return goalTemplateIds;
  }

  render() {
    const { onClick, patientConcern, selected, inactive, selectedTaskId, isDragging } = this.props;
    if (patientConcern.deletedAt) return null;

    const { patientGoals, concern } = patientConcern;

    const goalsStyles = classNames(styles.goals, {
      [styles.hidden]: !selected || (!patientGoals || !patientGoals.length),
    });
    const { goalCount, taskCount, lastUpdated, hasBadge } = this.getStats();

    const isInactive = inactive || !!selectedTaskId;
    const isSelected = isDragging || (!selectedTaskId && selected);

    const mainStyles = classNames(styles.main, {
      [styles.inactive]: isInactive && !isSelected,
      [styles.selected]: isSelected,
      [styles.administrative]: concern.title === adminTasksConcernTitle,
      [styles.notificationBadge]: hasBadge,
    });

    return (
      <div>
        <div className={styles.container}>
          <div className={mainStyles} onClick={onClick}>
            <div className={styles.row}>
              <h3>{patientConcern.concern.title}</h3>
              <PatientConcernOptions
                patientId={patientConcern.patientId}
                patientConcernId={patientConcern.id}
                patientConcernTitle={patientConcern.concern.title}
                goalSuggestionTemplateIds={this.getGoalSuggestionTemplateIds()}
                taskOpen={!!selectedTaskId}
                canDelete={!!patientGoals && !patientGoals.length}
              />
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
      </div>
    );
  }
}

export default PatientConcern;
