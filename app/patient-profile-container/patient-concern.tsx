import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { DATETIME_FORMAT } from '../config';
import { FullPatientConcernFragment } from '../graphql/types';
import * as styles from './css/patient-care-plan.css';
import PatientGoal from './patient-goal';

export interface IProps {
  patientConcern: FullPatientConcernFragment;
  selected: boolean;
  onClick: (id: string) => any;
}

export interface IPatientConcernStats {
  goalCount: number;
  taskCount: number;
  lastUpdated: string;
}

export default class PatientConcern extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.getStats = this.getStats.bind(this);
    this.renderGoals = this.renderGoals.bind(this);
  }

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

        const goalLastUpdated = moment(patientGoal.updatedAt, DATETIME_FORMAT);
        const goalMoreRecentlyUpdated = goalLastUpdated
          .isAfter(moment(stats.lastUpdated, DATETIME_FORMAT));

        if (goalMoreRecentlyUpdated) {
          stats.lastUpdated = patientGoal.updatedAt;
        }

        if (tasks && tasks.length) {
          stats.taskCount += tasks.length;

          tasks.forEach(task => {
            const taskLastUpdated = moment(task.updatedAt, DATETIME_FORMAT);
            const taskMoreRecentlyUpdated = taskLastUpdated
              .isAfter(moment(stats.lastUpdated, DATETIME_FORMAT));

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

    return patientGoals.map((patientGoal, index) =>
      <PatientGoal key={patientGoal.id} patientGoal={patientGoal} goalNumber={index + 1} />,
    );
  }

  render() {
    const { onClick, patientConcern, selected } = this.props;
    const { patientGoals } = patientConcern;

    const patientConcernStyles = classNames(styles.patientConcern, {
      [styles.selected]: selected,
    });
    const patientGoalsStyles = classNames(styles.patientGoals, {
      [styles.hidden]: !selected || (!patientGoals || !patientGoals.length),
    });

    const patientConcernStats = this.getStats();
    const { goalCount, taskCount, lastUpdated } = patientConcernStats;
    const createdAt = moment(patientConcern.createdAt, DATETIME_FORMAT).format('MMM D, YYYY');
    const updatedAt = moment(lastUpdated, DATETIME_FORMAT).format('MMM D, YYYY');

    return (
      <div className={styles.patientConcernGroup}>
        <div className={patientConcernStyles} onClick={() => onClick(patientConcern.id)}>
          <div className={styles.patientConcernTitleRow}>
            <div className={styles.patientConcernTitle}>{patientConcern.concern.title}</div>
            <div className={styles.patientConcernHamburger}></div>
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
                <div className={styles.patientConcernDateValue}>{createdAt}</div>
              </div>
              <div className={styles.patientConcernDate}>
                <div className={styles.patientConcernDateLabel}>Last update:</div>
                <div className={styles.patientConcernDateValue}>{updatedAt}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={patientGoalsStyles}>
          {this.renderGoals()}
        </div>
      </div>
    );
  }
}
