import * as React from 'react';
import ModalButtons from '../library/modal-buttons/modal-buttons';
import ModalError from '../library/modal-error/modal-error';
import ModalHeader from '../library/modal-header/modal-header';
import { Popup } from '../popup/popup';
import AddressForm from './address-form';
import * as styles from './css/address-modal.css';

export interface IAddress {
  street?: string | null;
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
  street?: string | null;
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
      street: null,
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
    const { address, saveAddress, closePopup, onSaved } = this.props;
    const originalAddress = address || {};
    const { street, state, zip, city, description } = this.state;

    const updatedAddress = {
      id: originalAddress.id,
      street: street || originalAddress.street,
      state: state || originalAddress.state,
      zip: zip || originalAddress.zip,
      city: city || originalAddress.city,
      description: description || originalAddress.description,
    };

    try {
      const response = await saveAddress(updatedAddress);
      onSaved(response);
      closePopup();
      this.clearState();
    } catch (err) {
      // TODO: do something with this error
      this.setState({ saveError: err.message });
    }
  };

  render() {
    const { isVisible, closePopup, titleMessageId } = this.props;
    const address = this.props.address || {};
    const { saveError, street, state, zip, city, description } = this.state;

    const errorComponent = saveError ? <ModalError errorMessageId="address.saveError" /> : null;

    return (
      <Popup visible={isVisible} closePopup={closePopup} style="no-padding">
        <ModalHeader titleMessageId={titleMessageId} closePopup={closePopup} />
        {errorComponent}
        <div className={styles.modalBody}>
          <AddressForm
            street={street || address.street}
            state={state || address.state}
            city={city || address.city}
            zip={zip || address.zip}
            description={description || address.description}
            onChange={this.handleChange}
          />
          <ModalButtons
            cancelMessageId="address.cancel"
            submitMessageId="address.save"
            cancel={closePopup}
            submit={this.handleSubmit}
          />
        </div>
      </Popup>
    );
  }
}

export default AddressModal;
