import * as React from 'react';
import FormLabel from '../../library/form-label/form-label';
import TextArea from '../../library/textarea/textarea';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface IState {
  complete: boolean;
}

class CreateTaskDescription extends React.Component<IProps, IState> {
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
          messageId="taskCreate.description"
          htmlFor="description"
          gray={!!value && complete}
          topPadding={true}
        />
        <TextArea
          value={value}
          onChange={onChange}
          placeholderMessageId="taskCreate.descriptionPlaceholder"
          onBlur={() => this.setState({ complete: true })}
          onFocus={() => this.setState({ complete: false })}
          id="description"
        />
      </div>
    );
  }
}

export default CreateTaskDescription;
