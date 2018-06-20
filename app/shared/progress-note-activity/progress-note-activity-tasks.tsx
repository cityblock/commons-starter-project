import classNames from 'classnames';
import { groupBy, keys } from 'lodash';
import React from 'react';
import { FullTaskEvent } from '../../graphql/types';
import styles from './css/progress-note-activity.css';
import ProgressNoteActivityTask from './progress-note-activity-task';

interface IProps {
  taskEvents: FullTaskEvent[];
  expanded: boolean;
}

interface IState {
  tasks: { [taskId: string]: FullTaskEvent[] };
}

class ProgressNoteActivityTasks extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const tasks = groupBy(props.taskEvents, 'taskId');

    this.state = { tasks };
  }

  renderActivityTasks = () => {
    const { tasks } = this.state;
    const { expanded } = this.props;

    return keys(tasks).map(taskId => (
      <ProgressNoteActivityTask key={taskId} taskEvents={tasks[taskId]} expanded={expanded} />
    ));
  };

  render() {
    const { expanded } = this.props;

    const sectionStyles = classNames(styles.sectionChild, {
      [styles.expanded]: expanded,
    });

    return <div className={sectionStyles}>{this.renderActivityTasks()}</div>;
  }
}

export default ProgressNoteActivityTasks;
