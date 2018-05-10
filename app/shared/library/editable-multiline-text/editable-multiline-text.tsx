import * as classNames from 'classnames';
import * as React from 'react';
import SmallText from '../small-text/small-text';
import TextAreaWithButton from '../textarea-with-button/textarea-with-button';
import * as styles from './css/editable-multiline-text.css';

interface IProps {
  text: string;
  onSubmit: (newText: string) => void;
  placeholderMessageId?: string; // optional translate message id for when field is empty
  disabled?: boolean; // if true, cannot click to edit
  descriptionField?: boolean; // if true, applies description field styles
}

interface IState {
  editMode: boolean;
  editedText: string;
}

// TODO: Modal when navigating away!
export class EditableMultilineText extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      editMode: false,
      editedText: props.text,
    };
  }

  componentWillReceiveProps(nextProps: IProps): void {
    if (nextProps.text !== this.props.text) {
      this.setState({ editedText: nextProps.text });
    }
  }

  handleClick = (): void => {
    if (!this.props.disabled) {
      this.setState({ editMode: true });
    }
  };

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ editedText: e.currentTarget.value });
  };

  handleSubmit = async (): Promise<void> => {
    await this.props.onSubmit(this.state.editedText);

    this.setState({ editMode: false });
  };

  render(): JSX.Element {
    const { text, placeholderMessageId, descriptionField } = this.props;
    const { editedText, editMode } = this.state;

    if (editMode) {
      return (
        <TextAreaWithButton
          value={editedText}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          submitMessageId="editableText.save"
          loadingMessageId="editableText.saving"
          placeholderMessageId={placeholderMessageId}
          titleStyles={!descriptionField}
        />
      );
    }

    if (!text) {
      return (
        <div onClick={this.handleClick}>
          <SmallText
            messageId={placeholderMessageId || 'editableText.clickToEdit'}
            font="basetica"
            color="lightGray"
            size="large"
          />
        </div>
      );
    }

    const textStyles = classNames(styles.text, {
      [styles.description]: !!descriptionField,
    });

    return (
      <div onClick={this.handleClick}>
        <p className={textStyles}>{text}</p>
      </div>
    );
  }
}

export default EditableMultilineText;
