import * as React from 'react';
import FormLabel from '../../library/form-label/form-label';
import TextInput from '../../library/text-input/text-input';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IState {
  complete: boolean;
}

class CreateTaskTitle extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { complete: false };
  }

  render(): JSX.Element {
    const { value, onChange } = this.props;
    const { complete } = this.state;

    return (
      <div>
        <FormLabel
          messageId="taskCreate.title"
          htmlFor="title"
          gray={!!value && complete}
          topPadding={true}
        />
        <TextInput
          value={value}
          onChange={onChange}
          placeholderMessageId="taskCreate.titlePlaceholder"
          onBlur={() => this.setState({ complete: true })}
          onFocus={() => this.setState({ complete: false })}
          id="title"
          name="title"
        />
      </div>
    );
  }
}

export default CreateTaskTitle;
