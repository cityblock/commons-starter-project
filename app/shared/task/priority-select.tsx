import * as classNames from 'classnames';
import * as React from 'react';
import {  taskEditMutation, taskEditMutationVariables, Priority } from '../../graphql/types';
import * as styles from './css/priority-select.css';

interface IProps {
  taskId: string;
  priority: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

interface IState {
  changePriorityError: string;
}

export const Option: React.StatelessComponent<{ value: string }> = ({ value }) => {
  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

  return <option value={value as Priority}>{`${capitalizedValue} priority`}</option>;
};

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
        await editTask({ variables: { taskId, priority }});
      } catch (err) {
        this.setState({ changePriorityError: err.message });
      }
    }
  }

  render(): JSX.Element {
    const { priority } = this.props;
    const selectStyles = classNames(styles.select, {
      [styles.yellow]: priority === 'medium',
      [styles.grey]: priority === 'low',
      [styles.error]: !!this.state.changePriorityError,
    });

    return (
      <div>
        <select value={priority || 'medium'} className={selectStyles} onChange={this.onChange}>
          <Option value='low' />
          <Option value='medium' />
          <Option value='high' />
        </select>
      </div>
    );
  }
}

export default PrioritySelect;
