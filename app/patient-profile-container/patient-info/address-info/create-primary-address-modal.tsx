import * as React from 'react';
import { graphql } from 'react-apollo';
import * as createPrimaryAddressMutationGraphql from '../../../graphql/queries/address-create-primary-for-patient-mutation.graphql';
import {
  addressCreatePrimaryForPatientMutation,
  addressCreatePrimaryForPatientMutationVariables,
} from '../../../graphql/types';
import AddressModal, { IAddress, ISavedAddress } from '../../../shared/address-modal/address-modal';

interface IProps {
  onSaved: (address: ISavedAddress) => void;
  patientInfoId: string;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  createPrimaryAddressMutation: (
    options: { variables: addressCreatePrimaryForPatientMutationVariables },
  ) => { data: addressCreatePrimaryForPatientMutation };
}

type allProps = IProps & IGraphqlProps;

class CreatePrimaryAddressModal extends React.Component<allProps> {
  createAddress = async (address: IAddress) => {
    if (address.id) {
      return;
    }

    const { createPrimaryAddressMutation, patientInfoId } = this.props;
    return createPrimaryAddressMutation({
      variables: {
        patientInfoId,
        street: address.street,
        state: address.state,
        city: address.city,
        description: address.description,
        zip: address.zip || '',
      },
    });
  };

  handleAddressSaved = (response: { data: addressCreatePrimaryForPatientMutation }) => {
    if (response.data.addressCreatePrimaryForPatient) {
      this.props.onSaved(response.data.addressCreatePrimaryForPatient);
    }
  };

  render() {
    const { isVisible, closePopup } = this.props;

    return (
      <AddressModal
        isVisible={isVisible}
        saveAddress={this.createAddress}
        onSaved={this.handleAddressSaved}
        closePopup={closePopup}
        titleMessageId="address.addPrimary"
      />
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(createPrimaryAddressMutationGraphql as any, {
  name: 'createPrimaryAddressMutation',
})(CreatePrimaryAddressModal);
