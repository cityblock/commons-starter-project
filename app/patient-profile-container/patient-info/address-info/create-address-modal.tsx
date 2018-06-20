import React from 'react';
import { graphql } from 'react-apollo';
import createAddressGraphql from '../../../graphql/queries/address-create-for-patient-mutation.graphql';
import { addressCreateForPatient, addressCreateForPatientVariables } from '../../../graphql/types';
import AddressModal, { IAddress, ISavedAddress } from '../../../shared/address-modal/address-modal';

interface IProps {
  onSaved: (address: ISavedAddress) => void;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
  isPrimary?: boolean;
}

interface IGraphqlProps {
  createAddress: (
    options: { variables: addressCreateForPatientVariables },
  ) => { data: addressCreateForPatient };
}

type allProps = IProps & IGraphqlProps;

export class CreateAddressModal extends React.Component<allProps> {
  createAddress = async (address: IAddress) => {
    if (address.id) {
      return;
    }

    const { createAddress, patientId, isPrimary } = this.props;
    return createAddress({
      variables: {
        patientId,
        street1: address.street1,
        street2: address.street2,
        state: address.state,
        city: address.city,
        description: address.description,
        zip: address.zip || '',
        isPrimary,
      },
    });
  };

  handleAddressSaved = (response: { data: addressCreateForPatient }) => {
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

export default graphql<any>(createAddressGraphql, {
  name: 'createAddress',
})(CreateAddressModal) as React.ComponentClass<IProps>;
