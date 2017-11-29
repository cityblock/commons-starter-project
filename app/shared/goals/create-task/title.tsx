import * as React from 'react';
import TextInput from '../../library/text-input/text-input';
import { FieldLabel } from './shared';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateTaskTitle: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange } = props;

  return (
    <div>
      <FieldLabel messageId="taskCreate.title" htmlFor="title" />
      <TextInput value={value} onChange={onChange} id="title" name="title" />
    </div>
  );
};

export default CreateTaskTitle;
