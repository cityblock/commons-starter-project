import { isNil } from 'lodash';
import React from 'react';
import { PhoneTypeOptions } from '../../graphql/types';
import Modal from '../library/modal/modal';
import PhoneForm from './phone-form';

export interface IPhone {
  phoneNumber?: string | null;
  type?: PhoneTypeOptions;
  description?: string | null;
  id?: string;
}

export interface ISavedPhone extends IPhone {
  id: string;
}

interface IProps {
  savePhone: (phone: IPhone, isPrimaryUpdatedToTrue: boolean) => Promise<any>;
  closePopup: () => void;
  onSaved: (response: any, isPrimaryUpdatedToTrue: boolean) => void;
  isVisible: boolean;
  isPrimary?: boolean;
  phone?: IPhone | null;
  titleMessageId?: string;
}

interface IState {
  phoneNumber: string | null;
  type: PhoneTypeOptions | null;
  description: string | null;
  saveError: string | null;
  updatedIsPrimary: boolean | null;
  isLoading: boolean;
}

class PhoneModal extends React.Component<IProps, IState> {
  state = {
    phoneNumber: null,
    type: null,
    description: null,
    saveError: null,
    updatedIsPrimary: null,
    isLoading: false,
  };

  clearState() {
    this.setState({
      phoneNumber: null,
      type: null,
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
    const { phone, savePhone, onSaved, isPrimary } = this.props;
    const originalPhone = phone || {};
    const { phoneNumber, type, description, updatedIsPrimary } = this.state;
    const isPrimaryUpdatedToTrue = updatedIsPrimary === true && updatedIsPrimary !== isPrimary;

    const updatedPhone = {
      id: originalPhone.id,
      phoneNumber: isNil(phoneNumber) ? originalPhone.phoneNumber : phoneNumber,
      type: type || originalPhone.type,
      description: isNil(description) ? originalPhone.description : description,
    };

    try {
      this.setState({ isLoading: true });
      const response = await savePhone(updatedPhone, !!updatedIsPrimary);
      if (response.errors && response.errors.length) {
        return this.setState({ saveError: response.errors[0].message, isLoading: false });
      }
      onSaved(response, isPrimaryUpdatedToTrue);
      this.handleClose();
    } catch (err) {
      this.setState({ saveError: err.message, isLoading: false });
    }
  };

  handleClose = () => {
    this.clearState();
    this.props.closePopup();
  };

  render() {
    const { isVisible, titleMessageId, isPrimary } = this.props;
    const phone = this.props.phone || {};
    const { saveError, phoneNumber, type, description, updatedIsPrimary, isLoading } = this.state;

    const updatedPhoneNumber = isNil(phoneNumber) ? phone.phoneNumber : phoneNumber;
    const updatedType = isNil(type) ? phone.type : type;
    const updatedDescription = isNil(description) ? phone.description : description;
    const currentIsPrimary = isNil(updatedIsPrimary) ? isPrimary : updatedIsPrimary;
    const onPrimaryChange = phone.id && !isPrimary ? this.handlePrimaryChange : undefined;

    return (
      <Modal
        isVisible={isVisible}
        isLoading={isLoading}
        titleMessageId={titleMessageId}
        cancelMessageId="phone.cancel"
        submitMessageId="phone.save"
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
