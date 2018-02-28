import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as editAddressMutationGraphql from '../../../graphql/queries/address-edit-mutation.graphql';
import * as editPatientInfoMutationGraphql from '../../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  addressEditMutation,
  addressEditMutationVariables,
  patientInfoEditMutation,
  patientInfoEditMutationVariables,
} from '../../../graphql/types';
import AddressModal, { IAddress, ISavedAddress } from '../../../shared/address-modal/address-modal';

interface IProps {
  onSaved: (address: ISavedAddress) => void;
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
  editAddress = async (address: IAddress, updatedIsPrimary: boolean) => {
    if (!address.id) {
      return;
    }

    const {
      editAddressMutation,
      editPatientInfoMutation,
      patientId,
      patientInfoId,
      isPrimary,
    } = this.props;

    if (updatedIsPrimary !== isPrimary) {
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

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(editAddressMutationGraphql as any, {
    name: 'editAddressMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(editPatientInfoMutationGraphql as any, {
    name: 'editPatientInfoMutation',
  }),
)(EditAddressModal);
