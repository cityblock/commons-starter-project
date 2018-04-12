import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as editPatientInfoMutationGraphql from '../../../graphql/queries/patient-info-edit-mutation.graphql';
import * as editPhoneMutationGraphql from '../../../graphql/queries/phone-edit-mutation.graphql';
import {
  patientInfoEditMutation,
  patientInfoEditMutationVariables,
  phoneEditMutation,
  phoneEditMutationVariables,
} from '../../../graphql/types';
import PhoneModal, { IPhone, ISavedPhone } from '../../../shared/phone-modal/phone-modal';

interface IProps {
  onSaved: (phone: ISavedPhone, isPrimaryUpdatedToTrue: boolean) => void;
  patientId: string;
  patientInfoId: string;
  phone?: ISavedPhone | null;
  isVisible: boolean;
  isPrimary?: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editPhoneMutation: (
    options: { variables: phoneEditMutationVariables },
  ) => { data: phoneEditMutation };
  editPatientInfoMutation: (
    options: { variables: patientInfoEditMutationVariables },
  ) => { data: patientInfoEditMutation };
}

type allProps = IProps & IGraphqlProps;

export class EditPhoneModal extends React.Component<allProps> {
  editPhone = async (phone: IPhone, isPrimaryUpdatedToTrue: boolean) => {
    if (!phone.id || !phone.phoneNumber) {
      return;
    }

    const { editPhoneMutation, editPatientInfoMutation, patientId, patientInfoId } = this.props;

    if (isPrimaryUpdatedToTrue) {
      await editPatientInfoMutation({
        variables: {
          patientInfoId,
          primaryPhoneId: phone.id,
        },
      });
    }

    return editPhoneMutation({
      variables: {
        patientId,
        phoneId: phone.id,
        phoneNumber: phone.phoneNumber,
        description: phone.description,
        type: phone.type,
      },
    });
  };

  handlePhoneSaved = (response: { data: phoneEditMutation }, isPrimaryUpdatedToTrue: boolean) => {
    if (response.data.phoneEdit) {
      this.props.onSaved(response.data.phoneEdit, isPrimaryUpdatedToTrue);
    }
  };

  render() {
    const { phone, isVisible, isPrimary, closePopup } = this.props;

    return (
      <PhoneModal
        isVisible={isVisible}
        isPrimary={isPrimary}
        phone={phone}
        savePhone={this.editPhone}
        onSaved={this.handlePhoneSaved}
        closePopup={closePopup}
        titleMessageId="phone.editPhone"
      />
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(editPhoneMutationGraphql as any, {
    name: 'editPhoneMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(editPatientInfoMutationGraphql as any, {
    name: 'editPatientInfoMutation',
  }),
)(EditPhoneModal);
