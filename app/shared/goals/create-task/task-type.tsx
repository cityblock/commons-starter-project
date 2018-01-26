import * as React from 'react';
import FormLabel from '../../library/form-label/form-label';
import Option from '../../library/option/option';
import Select from '../../library/select/select';
import { TaskType } from './create-task';
import * as styles from './css/shared.css';

interface IProps {
  value: TaskType;
  onChange: (e?: any) => void;
}

const CreateTaskType: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange } = props;

  return (
    <div>
      <FormLabel messageId="taskCreate.type" gray={!!value} topPadding={true} />
      <Select value={value} onChange={onChange} className={styles.select}>
        <Option value="" messageId="taskCreate.selectType" disabled={true} />
        <Option value="general" messageId="taskCreate.general" />
        <Option value="CBOReferral" messageId="taskCreate.CBOReferral" />
      </Select>
    </div>
  );
};

export default CreateTaskType;
