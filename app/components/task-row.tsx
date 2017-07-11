import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from '../css/components/task-row.css';
import { ShortTaskFragment } from '../graphql/types';

export interface IProps {
  task: ShortTaskFragment;
  selected: boolean;
  onClick: (taskId: string) => any;
}

export default class TaskRow extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { task, selected, onClick } = this.props;

    const taskClass = classNames(
      styles.task,
      { [styles.selected]: selected },
    );

    return (
      <div
        className={taskClass}
        onClick={() => (onClick(task.id))}>
        {task.id}
      </div>
    );
  }
}
