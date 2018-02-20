import * as React from 'react';
import { graphql } from 'react-apollo';
import * as editAddressMutationGraphql from '../../../graphql/queries/address-edit-mutation.graphql';
import { addressEditMutation, addressEditMutationVariables } from '../../../graphql/types';
import AddressModal, { IAddress, ISavedAddress } from '../../../shared/address-modal/address-modal';

interface IProps {
  onSaved: (address: ISavedAddress) => void;
  patientId: string;
  address?: ISavedAddress | null;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editAddressMutation: (
    options: { variables: addressEditMutationVariables },
  ) => { data: addressEditMutation };
}

type allProps = IProps & IGraphqlProps;

class EditAddressModal extends React.Component<allProps> {
  editAddress = async (address: IAddress) => {
    if (!address.id) {
      return;
    }

    const { editAddressMutation, patientId } = this.props;
    return editAddressMutation({
      variables: {
        patientId,
        addressId: address.id,
        street: address.street,
        state: address.state,
        city: address.city,
        description: address.description,
        zip: address.zip,
      },
    });
  };

  handleAddressSaved = (response: { data: addressEditMutation }) => {
    if (response.data.addressEdit) {
      this.props.onSaved(response.data.addressEdit);
    }
  };

  render() {
    const { address, isVisible, closePopup } = this.props;

    return (
      <AddressModal
        isVisible={isVisible}
        address={address}
        saveAddress={this.editAddress}
        onSaved={this.handleAddressSaved}
        closePopup={closePopup}
        titleMessageId="address.editAddress"
      />
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(editAddressMutationGraphql as any, {
  name: 'editAddressMutation',
})(EditAddressModal);
