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
    const deletedTaskEvent = taskEvents.some(event => event.eventType === 'delete_task');

    if (completedTaskEvent) {
      return 'Task completed';
    }
    if (deletedTaskEvent) {
      return 'Task deleted';
    }

    return `${updateCount} update${updateCount !== 1 ? 's' : ''}`;
  }

  render() {
    const { expanded, taskEvents } = this.props;
    const priority = taskEvents[0] ? taskEvents[0].task.priority : null;
    const title = taskEvents[0] ? taskEvents[0].task.title : null;
    const taskActivityRowStyles = classNames(styles.taskActivityRow, {
      [styles.expanded]: expanded,
      [styles.highPriority]: priority === 'high',
      [styles.mediumPriority]: priority === 'medium',
    });

    return (
      <div className={taskActivityRowStyles}>
        <div className={styles.taskActivityInfo}>
          <div className={styles.taskActivityTitle}>{title}</div>
          <div className={styles.taskActivityUpdateText}>{this.getActivityDescription()}</div>
        </div>
        <div className={styles.taskActivityFollowers} />
      </div>
    );
  }
}

export default ProgressNoteActivityTask;
