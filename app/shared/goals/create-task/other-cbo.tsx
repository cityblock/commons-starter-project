import * as React from 'react';
import TextInput from '../../library/text-input/text-input';
import { ChangeEvent } from './create-task';
import * as styles from './css/shared.css';

interface IProps {
  CBOName: string;
  CBOUrl: string;
  onChange: (field: string) => (e: ChangeEvent) => void;
}

const CreateTaskOtherCBO: React.StatelessComponent<IProps> = (props: IProps) => {
  const { CBOName, CBOUrl, onChange } = props;

  return (
    <div>
      <TextInput
        value={CBOName}
        onChange={onChange('CBOName')}
        placeholderMessageId="taskCreate.CBOName"
        className={styles.marginTop}
      />
      <TextInput
        value={CBOUrl}
        onChange={onChange('CBOUrl')}
        placeholderMessageId="taskCreate.CBOUrl"
        className={styles.marginTop}
      />
    </div>
  );
};

export default CreateTaskOtherCBO;
