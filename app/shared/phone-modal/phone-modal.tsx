import { isNil } from 'lodash-es';
import * as React from 'react';
import { PhoneTypeOptions } from '../../graphql/types';
import Modal from '../library/modal/modal';
import PhoneForm from './phone-form';

export interface IPhone {
  phoneNumber?: string | null;
  type?: PhoneTypeOptions | null;
  description?: string | null;
  id?: string;
}

export interface ISavedPhone extends IPhone {
  id: string;
}

interface IProps {
  savePhone: (phone: IPhone, isPrimary: boolean) => Promise<any>;
  closePopup: () => void;
  onSaved: (response: any) => void;
  isVisible: boolean;
  isPrimary?: boolean;
  phone?: IPhone | null;
  titleMessageId?: string;
}

interface IState {
  phoneNumber?: string | null;
  type?: PhoneTypeOptions | null;
  description?: string | null;
  saveError?: string | null;
  updatedIsPrimary?: boolean | null;
}

class PhoneModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  clearState() {
    this.setState({
      phoneNumber: null,
      type: null,
      description: null,
      saveError: null,
      updatedIsPrimary: null,
    });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value });
  };

  handlePrimaryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const updatedIsPrimary = value === 'true';
    this.setState({ updatedIsPrimary });
  };

  handleSubmit = async () => {
    const { phone, savePhone, onSaved } = this.props;
    const originalPhone = phone || {};
    const { phoneNumber, type, description, updatedIsPrimary } = this.state;

    const updatedPhone = {
      id: originalPhone.id,
      phoneNumber: phoneNumber || originalPhone.phoneNumber,
      type: type || originalPhone.type,
      description: description || originalPhone.description,
    };

    try {
      const response = await savePhone(updatedPhone, !!updatedIsPrimary);
      onSaved(response);
      this.handleClose();
    } catch (err) {
      // TODO: do something with this error
      this.setState({ saveError: err.message });
    }
  };

  handleClose = () => {
    this.clearState();
    this.props.closePopup();
  };

  render() {
    const { isVisible, titleMessageId, isPrimary } = this.props;
    const phone = this.props.phone || {};
    const { saveError, phoneNumber, type, description, updatedIsPrimary } = this.state;

    const updatedPhoneNumber = isNil(phoneNumber) ? phone.phoneNumber : phoneNumber;
    const updatedType = isNil(type) ? phone.type : type;
    const updatedDescription = isNil(description) ? phone.description : description;
    const currentIsPrimary = isNil(updatedIsPrimary) ? isPrimary : updatedIsPrimary;
    const onPrimaryChange = phone.id && !isPrimary ? this.handlePrimaryChange : undefined;

    return (
      <Modal
        isVisible={isVisible}
        titleMessageId={titleMessageId}
        cancelMessageId="phone.cancel"
        submitMessageId="phone.save"
        errorMessageId="phone.saveError"
        error={saveError}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        <PhoneForm
          phoneNumber={updatedPhoneNumber}
          type={updatedType}
          description={updatedDescription}
          onChange={this.handleChange}
          onPrimaryChange={onPrimaryChange}
          isPrimary={currentIsPrimary}
        />
      </Modal>
    );
  }
}

export default PhoneModal;
