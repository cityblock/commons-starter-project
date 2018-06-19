import { isNil } from 'lodash';
import React from 'react';
import Modal from '../library/modal/modal';
import AddressForm from './address-form';

export interface IAddress {
  street1?: string | null;
  street2?: string | null;
  state?: string | null;
  zip?: string | null;
  city?: string | null;
  description?: string | null;
  id?: string;
}

export interface ISavedAddress extends IAddress {
  id: string;
}

interface IProps {
  saveAddress: (address: IAddress, isPrimaryUpdatedToTrue: boolean) => Promise<any>;
  closePopup: () => void;
  onSaved: (response: any, isPrimaryUpdatedToTrue: boolean) => void;
  isVisible: boolean;
  isPrimary?: boolean;
  address?: IAddress | null;
  titleMessageId?: string;
}

interface IState {
  street1?: string | null;
  street2?: string | null;
  state?: string | null;
  zip?: string | null;
  city?: string | null;
  description?: string | null;
  saveError?: string | null;
  updatedIsPrimary?: boolean | null;
}

class AddressModal extends React.Component<IProps, IState> {
  state = {
    street1: null,
    street2: null,
    state: null,
    zip: null,
    city: null,
    description: null,
    saveError: null,
    updatedIsPrimary: null,
  };

  clearState() {
    this.setState({
      street1: null,
      street2: null,
      state: null,
      zip: null,
      city: null,
      description: null,
      saveError: null,
      updatedIsPrimary: null,
    });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handlePrimaryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const updatedIsPrimary = value === 'true';
    this.setState({ updatedIsPrimary });
  };

  handleSubmit = async () => {
    const { address, saveAddress, onSaved, isPrimary } = this.props;
    const originalAddress = address || {};
    const { street1, street2, state, zip, city, description, updatedIsPrimary } = this.state;
    const isPrimaryUpdatedToTrue = updatedIsPrimary === true && updatedIsPrimary !== isPrimary;

    const updatedAddress = {
      id: originalAddress.id,
      street1: street1 || originalAddress.street1,
      street2: street2 || originalAddress.street2,
      state: state || originalAddress.state,
      zip: zip || originalAddress.zip,
      city: city || originalAddress.city,
      description: description || originalAddress.description,
    };

    try {
      const response = await saveAddress(updatedAddress, isPrimaryUpdatedToTrue);
      onSaved(response, isPrimaryUpdatedToTrue);
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
    const { isVisible, isPrimary, titleMessageId } = this.props;
    const address = this.props.address || {};
    const { saveError, updatedIsPrimary, street1, street2, state, zip, city, description } = this.state;

    const updatedStreet1 = isNil(street1) ? address.street1 : street1;
    const updatedStreet2 = isNil(street2) ? address.street2 : street2;
    const updatedState = isNil(state) ? address.state : state;
    const updatedCity = isNil(city) ? address.city : city;
    const updatedZip = isNil(zip) ? address.zip : zip;
    const updatedDescription = isNil(description) ? address.description : description;
    const currentIsPrimary = isNil(updatedIsPrimary) ? isPrimary : updatedIsPrimary;
    const onPrimaryChange = address.id && !isPrimary ? this.handlePrimaryChange : undefined;

    return (
      <Modal
        isVisible={isVisible}
        titleMessageId={titleMessageId}
        cancelMessageId="address.cancel"
        submitMessageId="address.save"
        errorMessageId="address.saveError"
        error={saveError}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        <AddressForm
          street1={updatedStreet1}
          street2={updatedStreet2}
          state={updatedState}
          city={updatedCity}
          zip={updatedZip}
          description={updatedDescription}
          onChange={this.handleChange}
          onPrimaryChange={onPrimaryChange}
          isPrimary={currentIsPrimary}
        />
      </Modal>
    );
  }
}

export default AddressModal;
