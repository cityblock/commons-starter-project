import React from 'react';
import { currentUserEdit, currentUserEditVariables } from '../graphql/types';
import Button from '../shared/library/button/button';
import Text from '../shared/library/text/text';
import TextAreaWithButton from '../shared/library/textarea-with-button/textarea-with-button';
import styles from './css/automated-response.css';

interface IProps {
  awayMessage: string;
  editCurrentUser: (options: { variables: currentUserEditVariables }) => { data: currentUserEdit };
}

interface IState {
  editedAwayMessage: string;
  editMode: boolean;
}

class AutomatedResponse extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      editedAwayMessage: props.awayMessage,
      editMode: false,
    };
  }

  handleSubmit = async (): Promise<void> => {
    // Note that loading and error handled in library component
    await this.props.editCurrentUser({
      variables: { awayMessage: this.state.editedAwayMessage },
    });

    this.setState({ editMode: false });
  };

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ editedAwayMessage: e.currentTarget.value });
  };

  enterEditMode = (): void => {
    this.setState({ editMode: true });
  };

  render(): JSX.Element {
    const { editedAwayMessage, editMode } = this.state;

    return (
      <div>
        <div className={styles.text}>
          <Text
            messageId="settings.autoResponse"
            size="largest"
            color="black"
            font="basetica"
            isBold
          />
          {!editMode && (
            <Button
              messageId="settings.autoResponseEdit"
              onClick={this.enterEditMode}
              color="white"
              className={styles.button}
            />
          )}
        </div>
        <TextAreaWithButton
          value={editedAwayMessage}
          placeholderMessageId="settings.autoResponsePlaceholder"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          submitMessageId="editableText.save"
          loadingMessageId="editableText.saving"
          disabled={!editMode}
        />
      </div>
    );
  }
}

export default AutomatedResponse;
