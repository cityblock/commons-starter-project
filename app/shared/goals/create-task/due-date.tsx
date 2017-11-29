import * as React from 'react';
import { formatDueDateDefault } from '../../helpers/format-helpers';
import DateInput from '../../library/date-input/date-input';
import * as styles from './css/shared.css';
import { FieldLabel } from './shared';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CreateTaskDescription: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange } = props;

  return (
    <div className={styles.flexItem}>
      <FieldLabel messageId="taskCreate.dueAt" htmlFor="due-date" />
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
