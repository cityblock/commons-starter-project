import * as classNames from 'classnames';
import * as React from 'react';
import { Priority } from '../../../graphql/types';
import PrioritySelect from '../../task/priority-select';
import * as priorityStyles from './css/priority.css';
import * as styles from './css/shared.css';
import { FieldLabel } from './shared';

interface IProps {
  onChange: (priority: Priority) => void;
  value: Priority | null;
}

const CreateTaskPriority: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange } = props;
  const className = classNames(styles.select, {
    [priorityStyles.circle]: !!value,
  });

  return (
    <div className={styles.flexItem}>
      <FieldLabel messageId="taskCreate.priority" htmlFor="priority" />
      <PrioritySelect priority={value} onPriorityClick={onChange} className={className} />
    </div>
  );
};

export default CreateTaskPriority;
