import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate } from 'react-intl';
import { FullPatientConcernFragment } from '../../graphql/types';
import PatientGoal from '../goals/goal';
import * as styles from './css/concern.css';
import PatientConcernOptions from './options-menu';

interface IProps {
  patientConcern: FullPatientConcernFragment;
  selected: boolean;
  optionsOpen: boolean;
  onClick: (id: string) => void;
  onOptionsToggle: (id: string) => (e: React.MouseEvent<HTMLDivElement>) => void;
  inactive?: boolean;
}

export interface IPatientConcernStats {
  goalCount: number;
  taskCount: number;
  lastUpdated: string;
}

export default class PatientConcern extends React.Component<IProps, {}> {
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
    const { patientConcern } = this.props;
    const { patientGoals } = patientConcern;

    if (!patientGoals) {
      return null;
    }

    return patientGoals.map((patientGoal, index) => (
      <PatientGoal key={patientGoal.id} patientGoal={patientGoal} goalNumber={index + 1} />
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
    } = this.props;
    const { patientGoals } = patientConcern;
    const hamburgerClass = classNames(styles.patientConcernHamburger, {
      [styles.hamburgerSelected]: optionsOpen,
    });

    const patientConcernStyles = classNames(styles.patientConcern, {
      [styles.selected]: selected,
      [styles.inactive]: inactive,
    });
    const patientGoalsStyles = classNames(styles.patientGoals, {
      [styles.hidden]: !selected || (!patientGoals || !patientGoals.length),
    });

    const patientConcernStats = this.getStats();
    const { goalCount, taskCount, lastUpdated } = patientConcernStats;
    return (
      <div className={styles.patientConcernGroup}>
        <div className={patientConcernStyles} onClick={() => onClick(patientConcern.id)}>
          <div className={styles.patientConcernTitleRow}>
            <div className={styles.patientConcernTitle}>{patientConcern.concern.title}</div>
            <div className={hamburgerClass} onClick={onOptionsToggle(patientConcern.id)}>
              {optionsOpen && <PatientConcernOptions inactive={inactive || false} />}
            </div>
          </div>
          <div className={styles.patientConcernMetaRow}>
            <div className={styles.patientConcernStats}>
              <div className={styles.patientConcernStat}>
                <div className={styles.patientConcernStatLabel}>Goals:</div>
                <div className={styles.patientConcernStatValue}>{goalCount}</div>
              </div>
              <div className={styles.patientConcernStat}>
                <div className={styles.patientConcernStatLabel}>Tasks:</div>
                <div className={styles.patientConcernStatValue}>{taskCount}</div>
              </div>
            </div>
            <div className={styles.patientConcernDates}>
              <div className={styles.patientConcernDate}>
                <div className={styles.patientConcernDateLabel}>Created:</div>
                <div className={styles.patientConcernDateValue}>
                  <FormattedDate
                    value={patientConcern.createdAt}
                    year="numeric"
                    month="short"
                    day="numeric"
                  />
                </div>
              </div>
              <div className={styles.patientConcernDate}>
                <div className={styles.patientConcernDateLabel}>Last update:</div>
                <div className={styles.patientConcernDateValue}>
                  <FormattedDate value={lastUpdated} year="numeric" month="short" day="numeric" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={patientGoalsStyles}>{this.renderGoals()}</div>
      </div>
    );
  }
}
