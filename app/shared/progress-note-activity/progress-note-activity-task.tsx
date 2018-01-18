import * as classNames from 'classnames';
import * as React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FullTaskEventFragment } from '../../graphql/types';
import * as styles from './css/progress-note-activity.css';

interface IProps {
  taskEvents: FullTaskEventFragment[];
  expanded: boolean;
}

class ProgressNoteActivityTask extends React.Component<IProps> {
  getActivityDescription(hasDeletedTaskEvent: boolean) {
    const { taskEvents } = this.props;
    const updateCount = taskEvents.length;
    const hasCompletedTaskEvent = taskEvents.some(event => event.eventType === 'complete_task');

    if (hasCompletedTaskEvent) {
      return 'Task completed';
    }
    if (hasDeletedTaskEvent) {
      return 'Task deleted';
    }

    return `${updateCount} update${updateCount !== 1 ? 's' : ''}`;
  }

  getTaskBody(hasDeletedTaskEvent: boolean) {
    const { taskEvents } = this.props;
    const title = taskEvents[0] ? taskEvents[0].task.title : null;
    return (
      <Fragment>
        <div className={styles.taskActivityInfo}>
          <div className={styles.taskActivityTitle}>{title}</div>
          <div className={styles.taskActivityUpdateText}>
            {this.getActivityDescription(hasDeletedTaskEvent)}
          </div>
        </div>
        <div className={styles.taskActivityFollowers} />
      </Fragment>
    );
  }

  render() {
    const { expanded, taskEvents } = this.props;

    const priority = taskEvents[0] ? taskEvents[0].task.priority : null;
    const taskId = taskEvents[0] ? taskEvents[0].task.id : null;
    const taskActivityRowStyles = classNames(styles.taskActivityRow, {
      [styles.expanded]: expanded,
      [styles.highPriority]: priority === 'high',
      [styles.mediumPriority]: priority === 'medium',
    });
    const deletedTaskEvent = taskEvents.some(event => event.eventType === 'delete_task');
    const taskBody = this.getTaskBody(deletedTaskEvent);
    if (deletedTaskEvent) {
      return <div className={taskActivityRowStyles}>{taskBody}</div>;
    } else {
      return (
        <Link className={taskActivityRowStyles} to={`/tasks/${taskId}`}>
          {taskBody}
        </Link>
      );
    }
  }
}

export default ProgressNoteActivityTask;
