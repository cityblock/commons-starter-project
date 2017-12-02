import * as classNames from 'classnames';
import * as React from 'react';
import { FullCarePlanUpdateEventFragment } from '../../graphql/types';
import * as styles from '../css/progress-note-activity.css';

interface IProps {
  carePlanUpdateEvents: FullCarePlanUpdateEventFragment[];
  updateType: 'concern' | 'goal';
  expanded: boolean;
}

class ProgressNoteActivityCarePlanUpdate extends React.Component<IProps> {
  getLabel = () => {
    const { carePlanUpdateEvents, updateType } = this.props;

    if (updateType === 'concern') {
      const started = !!carePlanUpdateEvents[0].patientConcern!.startedAt;
      return `${started ? 'Active' : 'Inactive'} Concern`;
    } else {
      return 'Goal';
    }
  };

  getTitle = () => {
    const { carePlanUpdateEvents, updateType } = this.props;
    const event = carePlanUpdateEvents[0];

    if (updateType === 'concern') {
      return event.patientConcern!.concern.title;
    } else {
      return event.patientGoal!.title;
    }
  };

  getUpdateCount = () => {
    const { carePlanUpdateEvents } = this.props;
    const updateCount = carePlanUpdateEvents.length;

    return `${updateCount} update${updateCount > 1 ? 's' : ''}`;
  };

  render() {
    const { expanded } = this.props;
    const carePlanUpdateRowStyles = classNames(styles.carePlanUpdateRow, {
      [styles.expanded]: expanded,
    });

    return (
      <div className={carePlanUpdateRowStyles}>
        <div className={styles.updateLabel}>{this.getLabel()}:</div>
        <div className={styles.updateTitle}>{this.getTitle()}</div>
        <div className={styles.updateCount}>{this.getUpdateCount()}</div>
      </div>
    );
  }
}

export default ProgressNoteActivityCarePlanUpdate;
