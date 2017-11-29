import * as React from 'react';
import TextArea from '../../library/textarea/textarea';
import { FieldLabel } from './shared';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CreateTaskDescription: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange } = props;

  return (
    <div>
      <FieldLabel messageId="taskCreate.description" htmlFor="description" />
      <TextArea value={value} onChange={onChange} id="description" name="description" />
    </div>
  );
};

export default CreateTaskDescription;
