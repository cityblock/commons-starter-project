import React from 'react';
import { graphql } from 'react-apollo';
import createAddressMutationGraphql from '../../../graphql/queries/address-create-for-patient-mutation.graphql';
import {
  addressCreateForPatientMutation,
  addressCreateForPatientMutationVariables,
} from '../../../graphql/types';
import AddressModal, { IAddress, ISavedAddress } from '../../../shared/address-modal/address-modal';

interface IProps {
  onSaved: (address: ISavedAddress) => void;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
  isPrimary?: boolean;
}

interface IGraphqlProps {
  createAddressMutation: (
    options: { variables: addressCreateForPatientMutationVariables },
  ) => { data: addressCreateForPatientMutation };
}

type allProps = IProps & IGraphqlProps;

export class CreateAddressModal extends React.Component<allProps> {
  createAddress = async (address: IAddress) => {
    if (address.id) {
      return;
    }

    const { createAddressMutation, patientId, isPrimary } = this.props;
    return createAddressMutation({
      variables: {
        patientId,
        street1: address.street1,
        state: address.state,
        city: address.city,
        description: address.description,
        zip: address.zip || '',
        isPrimary,
      },
    });
  };

  handleAddressSaved = (response: { data: addressCreateForPatientMutation }) => {
    if (response.data.addressCreateForPatient) {
      this.props.onSaved(response.data.addressCreateForPatient);
    }
  };

  render() {
    const { isVisible, closePopup, isPrimary } = this.props;
    const titleMessageId = isPrimary ? 'address.addPrimary' : 'address.addAdditional';

    return (
      <AddressModal
        isVisible={isVisible}
        saveAddress={this.createAddress}
        onSaved={this.handleAddressSaved}
        closePopup={closePopup}
        titleMessageId={titleMessageId}
      />
    );
  }
}

export default graphql<any>(createAddressMutationGraphql, {
  name: 'createAddressMutation',
})(CreateAddressModal) as React.ComponentClass<IProps>;
