import * as React from 'react';
import { formatDueDateDefault } from '../../helpers/format-helpers';
import DateInput from '../../library/date-input/date-input';
import FormLabel from '../../library/form-label/form-label';
import * as styles from './css/shared.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CreateTaskDescription: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange } = props;

  return (
    <div className={styles.flexItem}>
      <FormLabel messageId="taskCreate.dueAt" htmlFor="due-date" gray={!!value} topPadding={true} />
      <DateInput
        value={value}
        onChange={onChange}
        className={styles.select}
        displayText={formatDueDateDefault(value)}
        id="due-date"
        name="due-date"
      />
    </div>
  );
};

export default CreateTaskDescription;
