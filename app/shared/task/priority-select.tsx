import * as classNames from 'classnames';
import * as React from 'react';
import { Priority } from '../../graphql/types';
import Option from '../library/option/option';
import Select from '../library/select/select';
import * as styles from './css/priority-select.css';

interface IProps {
  priority: Priority | null;
  onPriorityClick: (priority: Priority) => void;
  className?: string;
}

interface IState {
  changePriorityError: string;
}

class PrioritySelect extends React.Component<IProps, IState> {
  state = {
    changePriorityError: '',
  };

  onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { onPriorityClick } = this.props;
    const priority = e.target.value as Priority;

    try {
      this.setState({ changePriorityError: '' });
      await onPriorityClick(priority);
    } catch (err) {
      this.setState({ changePriorityError: err.message });
    }
  };

  render(): JSX.Element {
    const { priority, className } = this.props;

    const selectStyles = classNames(
      styles.select,
      {
        [styles.red]: priority === 'high',
        [styles.yellow]: priority === 'medium',
        [styles.grey]: priority === 'low',
        [styles.error]: !!this.state.changePriorityError,
      },
      className,
    );

    return (
      <Select value={priority || ''} className={selectStyles} onChange={this.onChange}>
        <Option value="" messageId="taskPriority.select" disabled={true} />
        <Option value="low" messageId="taskPriority.low" />
        <Option value="medium" messageId="taskPriority.medium" />
        <Option value="high" messageId="taskPriority.high" />
      </Select>
    );
  }
}

export default PrioritySelect;
