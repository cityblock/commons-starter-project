import React from 'react';
import { compose, graphql } from 'react-apollo';
import editAddressMutationGraphql from '../../../graphql/queries/address-edit-mutation.graphql';
import editPatientInfoMutationGraphql from '../../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  addressEditMutation,
  addressEditMutationVariables,
  patientInfoEditMutation,
  patientInfoEditMutationVariables,
} from '../../../graphql/types';
import AddressModal, { IAddress, ISavedAddress } from '../../../shared/address-modal/address-modal';

interface IProps {
  onSaved: (address: ISavedAddress, isPrimaryUpdatedToTrue: boolean) => void;
  patientId: string;
  patientInfoId: string;
  address?: ISavedAddress | null;
  isVisible: boolean;
  isPrimary?: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editAddressMutation: (
    options: { variables: addressEditMutationVariables },
  ) => { data: addressEditMutation };
  editPatientInfoMutation: (
    options: { variables: patientInfoEditMutationVariables },
  ) => { data: patientInfoEditMutation };
}

type allProps = IProps & IGraphqlProps;

export class EditAddressModal extends React.Component<allProps> {
  editAddress = async (address: IAddress, isPrimaryUpdatedToTrue: boolean) => {
    if (!address.id) {
      return;
    }

    const { editAddressMutation, editPatientInfoMutation, patientId, patientInfoId } = this.props;

    if (isPrimaryUpdatedToTrue) {
      await editPatientInfoMutation({
        variables: {
          patientInfoId,
          primaryAddressId: address.id,
        },
      });
    }

    return editAddressMutation({
      variables: {
        patientId,
        addressId: address.id,
        street1: address.street1,
        state: address.state,
        city: address.city,
        description: address.description,
        zip: address.zip,
      },
    });
  };

  handleAddressSaved = (
    response: { data: addressEditMutation },
    isPrimaryUpdatedToTrue: boolean,
  ) => {
    if (response.data.addressEdit) {
      this.props.onSaved(response.data.addressEdit, isPrimaryUpdatedToTrue);
    }
  };

  render() {
    const { address, isVisible, closePopup, isPrimary } = this.props;

    return (
      <AddressModal
        isVisible={isVisible}
        isPrimary={isPrimary}
        address={address}
        saveAddress={this.editAddress}
        onSaved={this.handleAddressSaved}
        closePopup={closePopup}
        titleMessageId="address.editAddress"
      />
    );
  }
}

export default compose(
  graphql(editAddressMutationGraphql, {
    name: 'editAddressMutation',
  }),
  graphql(editPatientInfoMutationGraphql, {
    name: 'editPatientInfoMutation',
  }),
)(EditAddressModal) as React.ComponentClass<IProps>;
