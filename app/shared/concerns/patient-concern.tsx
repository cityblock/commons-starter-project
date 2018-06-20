import classNames from 'classnames';
import React from 'react';
import { adminTasksConcernTitle } from '../../../server/lib/consts';
import { FullPatientConcern } from '../../graphql/types';
import { isDueSoon } from '../../shared/helpers/format-helpers';
import { isCBOReferralRequiringActionForUser } from '../../shared/task/helpers/helpers';
import PatientGoal from '../goals/goal';
import PatientConcernStats from './concern-stats/concern-stats';
import styles from './css/patient-concern.css';
import PatientConcernOptions from './options-menu/options-menu';

interface IProps {
  patientConcern: FullPatientConcern;
  selected: boolean;
  onClick: (e?: React.MouseEvent<HTMLDivElement>) => void;
  inactive?: boolean;
  selectedTaskId: string;
  selectedGoalId: string;
  isDragging?: boolean;
  taskIdsWithNotifications?: string[];
  currentUserId: string;
}

export interface IPatientConcernStats {
  goalCount: number;
  taskCount: number;
  lastUpdated: string;
  hasBadge: boolean;
  isConcernSelected: boolean;
}

export class PatientConcern extends React.Component<IProps, {}> {
  getStats() {
    const { patientConcern, taskIdsWithNotifications, currentUserId, selectedGoalId } = this.props;
    const { patientGoals } = patientConcern;

    const stats: IPatientConcernStats = {
      goalCount: 0,
      taskCount: 0,
      lastUpdated: patientConcern.updatedAt,
      hasBadge: false,
      isConcernSelected: false,
    };

    if (patientGoals && patientGoals.length) {
      stats.goalCount = patientGoals.length;

      patientGoals.forEach(patientGoal => {
        const { tasks } = patientGoal;

        if (patientGoal.id === selectedGoalId) {
          stats.isConcernSelected = true;
        }

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

            const dueSoonForUser = isDueSoon(task.dueAt) && task.assignedToId === currentUserId;
            const isCBOReferralRequiringAction = isCBOReferralRequiringActionForUser(
              task,
              currentUserId,
            );

            const hasNotification =
              !!taskIdsWithNotifications && taskIdsWithNotifications.includes(task.id);
            stats.hasBadge =
              stats.hasBadge || dueSoonForUser || hasNotification || isCBOReferralRequiringAction;
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
    const { onClick, patientConcern, inactive, selectedTaskId, isDragging } = this.props;
    if (patientConcern.deletedAt) return null;

    const { patientGoals, concern } = patientConcern;
    const { goalCount, taskCount, lastUpdated, hasBadge, isConcernSelected } = this.getStats();
    const selected = this.props.selected || isConcernSelected;

    const goalsStyles = classNames(styles.goals, {
      [styles.hidden]: !selected || (!patientGoals || !patientGoals.length),
    });

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
