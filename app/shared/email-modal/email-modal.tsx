import { isNil } from 'lodash';
import React from 'react';
import Modal from '../library/modal/modal';
import EmailForm from './email-form';

export interface IEmail {
  emailAddress?: string | null;
  description?: string | null;
  id?: string;
}

export interface ISavedEmail extends IEmail {
  id: string;
}

interface IProps {
  saveEmail: (email: IEmail, isPrimaryUpdatedToTrue: boolean) => Promise<any>;
  closePopup: () => void;
  onSaved: (response: any, isPrimaryUpdatedToTrue: boolean) => void;
  isVisible: boolean;
  isPrimary?: boolean;
  email?: IEmail | null;
  titleMessageId?: string;
}

interface IState {
  emailAddress?: string | null;
  description?: string | null;
  saveError?: string | null;
  updatedIsPrimary?: boolean | null;
  isLoading: boolean;
}

class EmailModal extends React.Component<IProps, IState> {
  state = {
    emailAddress: null,
    description: null,
    saveError: null,
    updatedIsPrimary: null,
    isLoading: false,
  };

  clearState() {
    this.setState({
      emailAddress: null,
      description: null,
      saveError: null,
      updatedIsPrimary: null,
      isLoading: false,
    });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value } as any);
  };

  handlePrimaryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const updatedIsPrimary = value === 'true';
    this.setState({ updatedIsPrimary });
  };

  handleSubmit = async () => {
    const { email, saveEmail, onSaved, isPrimary } = this.props;
    const originalEmail = email || {};
    const { emailAddress, description, updatedIsPrimary } = this.state;
    const isPrimaryUpdatedToTrue = updatedIsPrimary === true && updatedIsPrimary !== isPrimary;

    const updatedEmail = {
      id: originalEmail.id,
      emailAddress: emailAddress || originalEmail.emailAddress,
      description: description || originalEmail.description,
    };

    try {
      this.setState({ isLoading: true });
      const response = await saveEmail(updatedEmail, isPrimaryUpdatedToTrue);
      onSaved(response, isPrimaryUpdatedToTrue);
      this.handleClose();
    } catch (err) {
      // TODO: do something with this error
      this.setState({ saveError: err.message, isLoading: false });
    }
  };

  handleClose = () => {
    this.clearState();
    this.props.closePopup();
  };

  render() {
    const { isVisible, titleMessageId, isPrimary } = this.props;
    const email = this.props.email || {};
    const { saveError, emailAddress, description, updatedIsPrimary, isLoading } = this.state;

    const updatedEmailAddress = isNil(emailAddress) ? email.emailAddress : emailAddress;
    const updatedDescription = isNil(description) ? email.description : description;
    const currentIsPrimary = isNil(updatedIsPrimary) ? isPrimary : updatedIsPrimary;
    const onPrimaryChange = email.id && !isPrimary ? this.handlePrimaryChange : undefined;

    return (
      <Modal
        isVisible={isVisible}
        isLoading={isLoading}
        titleMessageId={titleMessageId}
        cancelMessageId="email.cancel"
        submitMessageId="email.save"
        errorMessageId="email.saveError"
        error={saveError}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        <EmailForm
          emailAddress={updatedEmailAddress}
          description={updatedDescription}
          onChange={this.handleChange}
          onPrimaryChange={onPrimaryChange}
          isPrimary={currentIsPrimary}
        />
      </Modal>
    );
  }
}

export default EmailModal;
