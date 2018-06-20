import React from 'react';
import { compose, graphql } from 'react-apollo';
import editAddressGraphql from '../../../graphql/queries/address-edit-mutation.graphql';
import editPatientInfoGraphql from '../../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  addressEdit,
  addressEditVariables,
  patientInfoEdit,
  patientInfoEditVariables,
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
  editAddress: (options: { variables: addressEditVariables }) => { data: addressEdit };
  editPatientInfo: (options: { variables: patientInfoEditVariables }) => { data: patientInfoEdit };
}

type allProps = IProps & IGraphqlProps;

export class EditAddressModal extends React.Component<allProps> {
  editAddress = async (address: IAddress, isPrimaryUpdatedToTrue: boolean) => {
    if (!address.id) {
      return;
    }

    const { editAddress, editPatientInfo, patientId, patientInfoId } = this.props;

    if (isPrimaryUpdatedToTrue) {
      await editPatientInfo({
        variables: {
          patientInfoId,
          primaryAddressId: address.id,
        },
      });
    }

    return editAddress({
      variables: {
        patientId,
        addressId: address.id,
        street1: address.street1,
        street2: address.street2,
        state: address.state,
        city: address.city,
        description: address.description,
        zip: address.zip,
      },
    });
  };

  handleAddressSaved = (response: { data: addressEdit }, isPrimaryUpdatedToTrue: boolean) => {
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
  graphql(editAddressGraphql, {
    name: 'editAddress',
  }),
  graphql(editPatientInfoGraphql, {
    name: 'editPatientInfo',
  }),
)(EditAddressModal) as React.ComponentClass<IProps>;
