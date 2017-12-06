import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as taskQuery from '../../graphql/queries/get-task.graphql';
import { FullTaskEventFragment, FullTaskFragment } from '../../graphql/types';
import * as styles from './css/progress-note-activity.css';

interface IProps {
  taskEvents: FullTaskEventFragment[];
  expanded: boolean;
}

interface IGraphqlProps {
  task?: FullTaskFragment;
  taskLoading?: boolean;
  taskError?: string;
}

type allProps = IProps & IGraphqlProps;

class ProgressNoteActivityTask extends React.Component<allProps> {
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
    const { expanded, task } = this.props;
    const taskActivityRowStyles = classNames(styles.taskActivityRow, {
      [styles.expanded]: expanded,
      [styles.highPriority]: task && task.priority === 'high',
      [styles.mediumPriority]: task && task.priority === 'medium',
    });

    return (
      <div className={taskActivityRowStyles}>
        <div className={styles.taskActivityInfo}>
          <div className={styles.taskActivityTitle}>{task ? task.title : ''}</div>
          <div className={styles.taskActivityUpdateText}>{this.getActivityDescription()}</div>
        </div>
        <div className={styles.taskActivityFollowers} />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(taskQuery as any, {
  skip: (props: allProps) => !props.taskEvents[0].taskId,
  options: (props: allProps) => ({ variables: { taskId: props.taskEvents[0].taskId } }),
  props: ({ data }) => ({
    taskLoading: data ? data.loading : false,
    taskError: data ? data.error : null,
    task: data ? (data as any).task : null,
    refetchTask: data ? data.refetch : null,
  }),
})(ProgressNoteActivityTask);
