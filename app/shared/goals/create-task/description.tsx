import * as React from 'react';
import FormLabel from '../../library/form-label/form-label';
import TextArea from '../../library/textarea/textarea';
import { TaskType } from './create-task';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  taskType: TaskType;
}

interface IState {
  complete: boolean;
}

class CreateTaskDescription extends React.Component<IProps, IState> {
  state = { complete: false };

  render(): JSX.Element {
    const { value, onChange, taskType } = this.props;
    const { complete } = this.state;
    const CBOReferralTask = taskType === 'CBOReferral';
    const messageId = CBOReferralTask ? 'taskCreate.referralNote' : 'taskCreate.description';
    const placeholderMessageId = CBOReferralTask
      ? 'taskCreate.noteDetail'
      : 'taskCreate.descriptionPlaceholder';

    return (
      <div>
        <FormLabel
          messageId={messageId}
          htmlFor="description"
          gray={!!value && complete}
          topPadding={true}
        />
        <TextArea
          value={value}
          onChange={onChange}
          placeholderMessageId={placeholderMessageId}
          onBlur={() => this.setState({ complete: true })}
          onFocus={() => this.setState({ complete: false })}
          name="description"
          id="description"
        />
      </div>
    );
  }
}

export default CreateTaskDescription;
