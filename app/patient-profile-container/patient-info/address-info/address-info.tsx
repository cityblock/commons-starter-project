import { concat, filter, findIndex, slice, values } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as addressDeleteMutationGraphql from '../../../graphql/queries/address-delete-for-patient-mutation.graphql';
import * as addressesQuery from '../../../graphql/queries/get-patient-addresses.graphql';
import {
  addressDeleteForPatientMutation,
  addressDeleteForPatientMutationVariables,
  getPatientAddressesQuery,
} from '../../../graphql/types';
import { ISavedAddress } from '../../../shared/address-modal/address-modal';
import Button from '../../../shared/library/button/button';
import Checkbox from '../../../shared/library/checkbox/checkbox';
import DefaultText from '../../../shared/library/default-text/default-text';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../../shared/with-error-handler/with-error-handler';
import DisplayCard from '../display-card';
import FlaggableDisplayField from '../flaggable-display-field';
import { IEditableFieldState } from '../patient-info';
import CreateAddressModal from './create-address-modal';
import * as styles from './css/address-info.css';
import EditAddressModal from './edit-address-modal';

interface IProps {
  onChange: (field: IEditableFieldState) => void;
  patientId: string;
  patientInfoId: string;
  isMarginallyHoused?: boolean | null;
  primaryAddress?: ISavedAddress | null;
  className?: string;
}

interface IGraphqlProps {
  addressDeleteMutation: (
    options: { variables: addressDeleteForPatientMutationVariables },
  ) => { data: addressDeleteForPatientMutation };
  addresses?: getPatientAddressesQuery['patientAddresses'];
  loading?: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps;

interface IState {
  isEditModalVisible: boolean;
  isCreateModalVisible: boolean;
  isPrimary: boolean;
  currentAddress?: ISavedAddress | null;
  updatedAddresses: ISavedAddress[] | null;
}

export class AddressInfo extends React.Component<allProps, IState> {
  state: IState = {
    isEditModalVisible: false,
    isCreateModalVisible: false,
    isPrimary: false,
    updatedAddresses: null,
  };

  handleAddressDelete = async (addressId: string, isPrimary: boolean) => {
    const { addressDeleteMutation, patientId, onChange, addresses, openErrorPopup } = this.props;
    try {
      await addressDeleteMutation({
        variables: {
          patientId,
          addressId,
          isPrimary,
        },
      });

      const currentAddresses = this.state.updatedAddresses || addresses || [];
      const updatedAddresses = filter(currentAddresses, address => address.id !== addressId);
      this.setState({ updatedAddresses });

      if (isPrimary) {
        onChange({ primaryAddress: null });
      }
    } catch (err) {
      openErrorPopup(err.message);
    }
  };

  handleAddAddressClick = () => {
    this.setState({ isCreateModalVisible: true });
  };

  handleAddPrimaryAddressClick = () => {
    this.setState({ isPrimary: true, isCreateModalVisible: true });
  };

  handleCloseModal = () => {
    this.setState({
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isPrimary: false,
    });
  };

  handleOpenEditModal = (address: ISavedAddress) => {
    const { primaryAddress } = this.props;
    const isPrimary = !!(primaryAddress && primaryAddress.id === address.id);

    this.setState({
      currentAddress: address,
      isEditModalVisible: true,
      isPrimary,
    });
  };

  handleSaveSuccess = (savedAddress: ISavedAddress) => {
    const { addresses } = this.props;
    const currentAddresses = this.state.updatedAddresses || addresses || [];
    const index = findIndex(currentAddresses, address => address.id === savedAddress.id);

    if (index < 0) {
      const updatedAddresses = [...currentAddresses, savedAddress];
      this.setState({ updatedAddresses });
    }
  };

  handleEditSuccess = (savedAddress: ISavedAddress, isPrimaryUpdatedToTrue: boolean) => {
    const { onChange, addresses } = this.props;
    const currentAddresses = this.state.updatedAddresses || addresses || [];

    const index = findIndex(currentAddresses, address => address.id === savedAddress.id);
    if (index > -1) {
      // insert updated address into the correct position in the array of addresses
      const updatedAddresses = concat(
        slice(currentAddresses, 0, index),
        savedAddress,
        slice(currentAddresses, index + 1),
      );
      this.setState({ updatedAddresses });
    }

    if (isPrimaryUpdatedToTrue) {
      onChange({ primaryAddress: savedAddress });
    }
  };

  handleSavePrimarySuccess = (savedAddress: ISavedAddress) => {
    this.handleSaveSuccess(savedAddress);

    const { onChange } = this.props;
    onChange({ primaryAddress: savedAddress });
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { name, checked } = event.target;
    onChange({ [name]: checked });
  };

  renderAddressDisplayCard(address: ISavedAddress) {
    const description = address.description ? (
      <FlaggableDisplayField labelMessageId="address.description" value={address.description} />
    ) : null;

    const isStarred = !!this.props.primaryAddress && this.props.primaryAddress.id === address.id;
    const titleMessageId = isStarred ? 'address.primaryAddress' : 'address.additionalAddress';

    return (
      <DisplayCard
        onEditClick={() => this.handleOpenEditModal(address)}
        onDeleteClick={async () => this.handleAddressDelete(address.id, isStarred)}
        key={`card-${address.id}`}
        className={styles.fieldMargin}
        isStarred={isStarred}
        titleMessageId={titleMessageId}
      >
        <div className={styles.fieldRow}>
          <FlaggableDisplayField labelMessageId="address.street1" value={address.street1 || null} />
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

    return addressComponent;
  }

  render() {
    const { addresses, patientId, patientInfoId, primaryAddress, isMarginallyHoused } = this.props;
    const {
      isEditModalVisible,
      isCreateModalVisible,
      isPrimary,
      currentAddress,
      updatedAddresses,
    } = this.state;

    const currentAddresses = updatedAddresses || addresses;
    const nonPrimaryAddresses = primaryAddress
      ? filter(currentAddresses, address => address.id !== primaryAddress.id)
      : currentAddresses;

    const addressCards =
      nonPrimaryAddresses && nonPrimaryAddresses.length
        ? values(nonPrimaryAddresses).map(address => this.renderAddressDisplayCard(address))
        : null;

    const addAddressButton = primaryAddress ? (
      <Button
        className={styles.addressButton}
        onClick={this.handleAddAddressClick}
        fullWidth={true}
        messageId="address.addAdditional"
      />
    ) : null;

    const onSavedFn = isPrimary ? this.handleSavePrimarySuccess : this.handleSaveSuccess;

    return (
      <div>
        <CreateAddressModal
          isVisible={isCreateModalVisible}
          isPrimary={isPrimary}
          closePopup={this.handleCloseModal}
          patientId={patientId}
          onSaved={onSavedFn}
        />
        <EditAddressModal
          isVisible={isEditModalVisible}
          isPrimary={isPrimary}
          closePopup={this.handleCloseModal}
          patientId={patientId}
          patientInfoId={patientInfoId}
          onSaved={this.handleEditSuccess}
          address={currentAddress}
        />
        <FormattedMessage id="address.addresses">
          {(message: string) => <h3 className={styles.addressTitle}>{message}</h3>}
        </FormattedMessage>
        <Checkbox
          name="isMarginallyHoused"
          isChecked={!!isMarginallyHoused}
          labelMessageId="patientInfo.marginal"
          onChange={this.handleChange}
          className={styles.fieldMargin}
        />
        {this.renderPrimaryAddress()}
        {addressCards}
        {addAddressButton}
      </div>
    );
  }
}

export default compose(
  withErrorHandler(),
  graphql(addressDeleteMutationGraphql as any, {
    name: 'addressDeleteMutation',
  }),
  graphql(addressesQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      addresses: data ? (data as any).patientAddresses : null,
    }),
  }),
)(AddressInfo) as React.ComponentClass<IProps>;
