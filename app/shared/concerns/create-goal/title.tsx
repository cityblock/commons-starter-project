import * as React from 'react';
import FormLabel from '../../library/form-label/form-label';
import TextInput from '../../library/text-input/text-input';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateGoalTitle: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange } = props;

  return (
    <div>
      <FormLabel messageId="goalCreate.title" htmlFor="title" />
      <TextInput
        value={value}
        placeholderMessageId="goalCreate.titlePlaceholder"
        onChange={onChange}
        id="title"
        name="title"
      />
    </div>
  );
};

export default CreateGoalTitle;
