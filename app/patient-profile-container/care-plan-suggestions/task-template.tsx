import classNames from 'classnames';
import React from 'react';
import { FullTaskTemplateFragment } from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import styles from './css/task-template.css';

interface IProps {
  taskTemplate: FullTaskTemplateFragment;
  selected: boolean;
  onToggle: (taskTemplateId: string) => void;
}

class TaskTemplate extends React.Component<IProps> {
  handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { taskTemplate, onToggle } = this.props;
    // prevent clicking on task from closing the goal
    e.stopPropagation();

    onToggle(taskTemplate.id);
  };

  render(): JSX.Element {
    const { taskTemplate, selected } = this.props;
    const iconName = selected ? 'highlightOff' : 'addCircle';
    const textStyles = classNames({
      [styles.opaque]: !selected,
    });

    return (
      <div className={styles.container} onClick={this.handleClick}>
        <h2 className={textStyles}>{taskTemplate.title}</h2>
        <Icon name={iconName} color="darkGray" />
      </div>
    );
  }
}

export default TaskTemplate;
