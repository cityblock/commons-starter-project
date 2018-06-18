import classNames from 'classnames';
import React from 'react';
import { Priority } from '../../../graphql/types';
import FormLabel from '../../library/form-label/form-label';
import PrioritySelect from '../../task/priority-select';
import priorityStyles from './css/priority.css';
import styles from './css/shared.css';

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
      <FormLabel
        messageId="taskCreate.priority"
        htmlFor="priority"
        gray={!!value}
        topPadding={true}
      />
      <PrioritySelect priority={value} onPriorityClick={onChange} className={className} />
    </div>
  );
};

export default CreateTaskPriority;
