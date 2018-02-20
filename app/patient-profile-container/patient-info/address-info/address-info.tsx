import { concat, findIndex, slice, values } from 'lodash-es';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ISavedAddress } from '../../../shared/address-modal/address-modal';
import Button from '../../../shared/library/button/button';
import DefaultText from '../../../shared/library/default-text/default-text';
import DisplayCard from '../display-card';
import FlaggableDisplayField from '../flaggable-display-field';
import CreateAddressModal from './create-address-modal';
import CreatePrimaryAddressModal from './create-primary-address-modal';
import * as styles from './css/address-info.css';
import EditAddressModal from './edit-address-modal';

interface IProps {
  onChange: (field: { name: string; value: string | object | boolean | null }) => void;
  patientId: string;
  patientInfoId: string;
  primaryAddress?: ISavedAddress | null;
  addresses?: ISavedAddress[];
  className?: string;
}

interface IState {
  isEditModalVisible: boolean;
  isCreateModalVisible: boolean;
  isCreatePrimaryModalVisible: boolean;
  currentAddress?: ISavedAddress | null;
}

export default class AddressInfo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isCreatePrimaryModalVisible: false,
    };
  }

  handleAddressDelete(addressId: string) {
    // TODO: implement address delete
  }

  handleAddAddressClick = () => {
    this.setState({ isCreateModalVisible: true });
  };

  handleAddPrimaryAddressClick = () => {
    this.setState({ isCreatePrimaryModalVisible: true });
  };

  handleCloseModal = () => {
    this.setState({
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isCreatePrimaryModalVisible: false,
    });
  };

  handleOpenEditModal = (address: ISavedAddress) => {
    this.setState({
      currentAddress: address,
      isEditModalVisible: true,
    });
  };

  handleSaveSuccess = (savedAddress: ISavedAddress) => {
    const { onChange } = this.props;
    const addresses = this.props.addresses || [];
    const index = findIndex(addresses, address => address.id === savedAddress.id);

    let updatedAddresses;
    if (index > -1) {
      updatedAddresses = concat(
        slice(addresses, 0, index),
        savedAddress,
        slice(addresses, index + 1),
      );
    } else {
      updatedAddresses = [...addresses, savedAddress];
    }

    onChange({ name: 'addresses', value: updatedAddresses });
  };

  renderAddressDisplayCard(address: ISavedAddress) {
    const description = address.description ? (
      <FlaggableDisplayField labelMessageId="address.description" value={address.description} />
    ) : null;

    return (
      <DisplayCard
        onEditClick={() => this.handleOpenEditModal(address)}
        onDeleteClick={() => this.handleAddressDelete(address.id)}
        key={`card-${address.id}`}
        className={styles.fieldMargin}
      >
        <div className={styles.fieldRow}>
          <FlaggableDisplayField labelMessageId="address.street" value={address.street || null} />
          <FlaggableDisplayField labelMessageId="address.city" value={address.city || null} />
          <FlaggableDisplayField labelMessageId="address.state" value={address.state || null} />
          <FlaggableDisplayField labelMessageId="address.zip" value={address.zip || null} />
        </div>
        {description}
      </DisplayCard>
    );
  }

  renderPrimaryAddress() {
    const { primaryAddress } = this.props;

    const addressComponent = primaryAddress ? (
      this.renderAddressDisplayCard(primaryAddress)
    ) : (
      <div className={styles.emptyRequiredBlock} onClick={this.handleAddPrimaryAddressClick}>
        <DefaultText messageId="address.addPrimary" />
      </div>
    );

    return (
      <div>
        <FormattedMessage id="address.primaryAddress">
          {(message: string) => <h3 className={styles.addressTitle}>{message}</h3>}
        </FormattedMessage>
        {addressComponent}
      </div>
    );
  }

  render() {
    const { addresses, patientId, patientInfoId, primaryAddress } = this.props;
    const {
      isEditModalVisible,
      isCreateModalVisible,
      isCreatePrimaryModalVisible,
      currentAddress,
    } = this.state;

    const addressCards =
      addresses && addresses.length ? (
        <div>
          <FormattedMessage id="address.additionalAddresses">
            {(message: string) => <h3 className={styles.addressTitle}>{message}</h3>}
          </FormattedMessage>
          {values(addresses).map(address => this.renderAddressDisplayCard(address))}
        </div>
      ) : null;

    const addAddressButon = primaryAddress ? (
      <Button
        className={styles.addressButton}
        onClick={this.handleAddAddressClick}
        fullWidth={true}
        messageId="address.addAdditional"
      />
    ) : null;

    return (
      <div>
        <CreateAddressModal
          isVisible={isCreateModalVisible}
          closePopup={this.handleCloseModal}
          patientId={patientId}
          onSaved={this.handleSaveSuccess}
        />
        <CreatePrimaryAddressModal
          isVisible={isCreatePrimaryModalVisible}
          closePopup={this.handleCloseModal}
          patientInfoId={patientInfoId}
          onSaved={this.handleSaveSuccess}
        />
        <EditAddressModal
          isVisible={isEditModalVisible}
          closePopup={this.handleCloseModal}
          patientId={patientId}
          onSaved={this.handleSaveSuccess}
          address={currentAddress}
        />
        {this.renderPrimaryAddress()}
        {addressCards}
        {addAddressButon}
      </div>
    );
  }
}
