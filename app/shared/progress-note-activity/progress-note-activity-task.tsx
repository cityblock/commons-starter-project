import * as classNames from 'classnames';
import * as React from 'react';
import { FullTaskEventFragment } from '../../graphql/types';
import * as styles from './css/progress-note-activity.css';

interface IProps {
  taskEvents: FullTaskEventFragment[];
  expanded: boolean;
}

class ProgressNoteActivityTask extends React.Component<IProps> {
  getActivityDescription() {
    const { taskEvents } = this.props;
    const updateCount = taskEvents.length;
    const completedTaskEvent = taskEvents.some(event => event.eventType === 'complete_task');

    if (completedTaskEvent) {
      return 'Task completed';
    }

    return `${updateCount} update${updateCount !== 1 ? 's' : ''}`;
  }

  render() {
    const { taskEvents, expanded } = this.props;
    const task = taskEvents[0].task;
    const taskActivityRowStyles = classNames(styles.taskActivityRow, {
      [styles.expanded]: expanded,
      [styles.highPriority]: task.priority === 'high',
      [styles.mediumPriority]: task.priority === 'medium',
    });

    return (
      <div className={taskActivityRowStyles}>
        <div className={styles.taskActivityInfo}>
          <div className={styles.taskActivityTitle}>{task.title}</div>
          <div className={styles.taskActivityUpdateText}>{this.getActivityDescription()}</div>
        </div>
        <div className={styles.taskActivityFollowers} />
      </div>
    );
  }
}

export default ProgressNoteActivityTask;
