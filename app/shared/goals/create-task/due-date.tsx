import * as React from 'react';
import DateInput from '../../library/date-input/date-input';
import FormLabel from '../../library/form-label/form-label';
import { TaskType } from './create-task';
import * as styles from './css/shared.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  taskType: TaskType;
}

const CreateTaskDescription: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, taskType } = props;
  const messageId = taskType === 'CBOReferral' ? 'taskCreate.completeReferral' : 'taskCreate.dueAt';

  return (
    <div className={styles.flexItem}>
      <FormLabel messageId={messageId} htmlFor="due-date" gray={!!value} topPadding={true} />
      <DateInput
        value={value}
        onChange={onChange}
        className={styles.dueDate}
        id="due-date"
        name="due-date"
      />
    </div>
  );
};

export default CreateTaskDescription;
