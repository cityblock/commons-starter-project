import { isNil } from 'lodash-es';
import * as React from 'react';
import ModalButtons from '../library/modal-buttons/modal-buttons';
import ModalError from '../library/modal-error/modal-error';
import ModalHeader from '../library/modal-header/modal-header';
import { Popup } from '../popup/popup';
import AddressForm from './address-form';
import * as styles from './css/address-modal.css';

export interface IAddress {
  street1?: string | null;
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
  saveAddress: (address: IAddress) => Promise<any>;
  closePopup: () => void;
  onSaved: (response: any) => void;
  isVisible: boolean;
  address?: IAddress | null;
  titleMessageId?: string;
}

interface IState {
  street1?: string | null;
  state?: string | null;
  zip?: string | null;
  city?: string | null;
  description?: string | null;
  saveError?: string | null;
}

class AddressModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  clearState() {
    this.setState({
      street1: null,
      state: null,
      zip: null,
      city: null,
      description: null,
      saveError: null,
    });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const { address, saveAddress, onSaved } = this.props;
    const originalAddress = address || {};
    const { street1, state, zip, city, description } = this.state;

    const updatedAddress = {
      id: originalAddress.id,
      street1: street1 || originalAddress.street1,
      state: state || originalAddress.state,
      zip: zip || originalAddress.zip,
      city: city || originalAddress.city,
      description: description || originalAddress.description,
    };

    try {
      const response = await saveAddress(updatedAddress);
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
    const { isVisible, titleMessageId } = this.props;
    const address = this.props.address || {};
    const { saveError, street1, state, zip, city, description } = this.state;

    const errorComponent = saveError ? <ModalError errorMessageId="address.saveError" /> : null;
    const updatedStreet1 = isNil(street1) ? address.street1 : street1;
    const updatedState = isNil(state) ? address.state : state;
    const updatedCity = isNil(city) ? address.city : city;
    const updatedZip = isNil(zip) ? address.zip : zip;
    const updatedDescription = isNil(description) ? address.description : description;

    return (
      <Popup visible={isVisible} closePopup={this.handleClose} style="no-padding">
        <ModalHeader titleMessageId={titleMessageId} closePopup={this.handleClose} />
        {errorComponent}
        <div className={styles.modalBody}>
          <AddressForm
            street1={updatedStreet1}
            state={updatedState}
            city={updatedCity}
            zip={updatedZip}
            description={updatedDescription}
            onChange={this.handleChange}
          />
          <ModalButtons
            cancelMessageId="address.cancel"
            submitMessageId="address.save"
            cancel={this.handleClose}
            submit={this.handleSubmit}
          />
        </div>
      </Popup>
    );
  }
}

export default AddressModal;
