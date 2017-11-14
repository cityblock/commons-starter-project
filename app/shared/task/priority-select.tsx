import * as classNames from 'classnames';
import * as React from 'react';
import { taskEditMutation, taskEditMutationVariables, Priority } from '../../graphql/types';
import Option from '../library/option';
import Select from '../library/select';
import * as styles from './css/priority-select.css';

interface IProps {
  taskId: string;
  priority: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

interface IState {
  changePriorityError: string;
}

class PrioritySelect extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      changePriorityError: '',
    };

    this.onChange = this.onChange.bind(this);
  }

  async onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { taskId, editTask } = this.props;
    const priority = e.target.value as Priority;

    if (taskId) {
      try {
        this.setState({ changePriorityError: '' });
        await editTask({ variables: { taskId, priority } });
      } catch (err) {
        this.setState({ changePriorityError: err.message });
      }
    }
  }

  render(): JSX.Element {
    const { priority } = this.props;

    const selectStyles = classNames(styles.select, {
      [styles.red]: priority === 'high',
      [styles.yellow]: priority === 'medium',
      [styles.grey]: priority === 'low',
      [styles.error]: !!this.state.changePriorityError,
    });

    return (
      <div>
        <Select value={priority || ''} className={selectStyles} onChange={this.onChange}>
          <Option value="" messageId="taskPriority.select" disabled={true} />
          <Option value="low" messageId="taskPriority.low" />
          <Option value="medium" messageId="taskPriority.medium" />
          <Option value="high" messageId="taskPriority.high" />
        </Select>
      </div>
    );
  }
}

export default PrioritySelect;
