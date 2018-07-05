import React from 'react';
import { graphql } from 'react-apollo';
import createPhoneGraphql from '../../../graphql/queries/phone-create-for-patient-mutation.graphql';
import { phoneCreateForPatient, phoneCreateForPatientVariables } from '../../../graphql/types';
import PhoneModal, { IPhone, ISavedPhone } from '../../../shared/phone-modal/phone-modal';

interface IProps {
  onSaved: (phone: ISavedPhone) => void;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
  isPrimary?: boolean;
}

interface IGraphqlProps {
  createPhone: (
    options: { variables: phoneCreateForPatientVariables },
  ) => { data: phoneCreateForPatient };
}

type allProps = IProps & IGraphqlProps;

export class CreatePhoneModal extends React.Component<allProps> {
  createPhone = async (phone: IPhone) => {
    let error;
    if (phone.id) {
      error = 'There was an issue saving this phone number';
    } else if (!phone.phoneNumber) {
      error = 'You must enter a phone number before saving';
    } else if (!phone.type) {
      error = 'You must select a type for the phone number before saving';
    }
    if (error) {
      return { errors: [{ message: error }] };
    }

    const { createPhone, patientId, isPrimary } = this.props;
    return createPhone({
      variables: {
        patientId,
        description: phone.description,
        phoneNumber: phone.phoneNumber!,
        type: phone.type!,
        isPrimary,
      },
    });
  };

  handlePhoneSaved = (response: { data: phoneCreateForPatient }) => {
    if (response.data.phoneCreateForPatient) {
      this.props.onSaved(response.data.phoneCreateForPatient);
    }
  };

  render() {
    const { isVisible, closePopup, isPrimary } = this.props;
    const titleMessageId = isPrimary ? 'phone.addPrimary' : 'phone.addAdditional';

    return (
      <PhoneModal
        isVisible={isVisible}
        savePhone={this.createPhone}
        onSaved={this.handlePhoneSaved}
        closePopup={closePopup}
        titleMessageId={titleMessageId}
      />
    );
  }
}

export default graphql<any>(createPhoneGraphql, {
  name: 'createPhone',
})(CreatePhoneModal) as React.ComponentClass<IProps>;
