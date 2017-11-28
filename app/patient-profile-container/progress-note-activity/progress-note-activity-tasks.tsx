import * as classNames from 'classnames';
import { groupBy, keys } from 'lodash';
import * as React from 'react';
import { FullTaskEventFragment } from '../../graphql/types';
import * as styles from '../css/progress-note-popup.css';
import ProgressNoteActivityTask from './progress-note-activity-task';

interface IProps {
  taskEvents: FullTaskEventFragment[];
  expanded: boolean;
}

interface IState {
  tasks: { [taskId: string]: FullTaskEventFragment[] };
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
