import React from 'react';
import { compose, graphql } from 'react-apollo';
import editEmailGraphql from '../../../graphql/queries/email-edit-mutation.graphql';
import editPatientInfoGraphql from '../../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  emailEdit,
  emailEditVariables,
  patientInfoEdit,
  patientInfoEditVariables,
} from '../../../graphql/types';
import EmailModal, { IEmail, ISavedEmail } from '../../../shared/email-modal/email-modal';

interface IProps {
  onSaved: (email: ISavedEmail, isPrimaryUpdatedToTrue: boolean) => void;
  patientId: string;
  patientInfoId: string;
  email?: ISavedEmail | null;
  isVisible: boolean;
  isPrimary?: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editEmail: (options: { variables: emailEditVariables }) => { data: emailEdit };
  editPatientInfo: (options: { variables: patientInfoEditVariables }) => { data: patientInfoEdit };
}

type allProps = IProps & IGraphqlProps;

export class EditEmailModal extends React.Component<allProps> {
  editEmail = async (email: IEmail, isPrimaryUpdatedToTrue: boolean) => {
    if (!email.id || !email.emailAddress) {
      return;
    }

    const { editEmail, editPatientInfo, patientId, patientInfoId } = this.props;

    if (isPrimaryUpdatedToTrue) {
      await editPatientInfo({
        variables: {
          patientInfoId,
          primaryEmailId: email.id,
        },
      });
    }

    return editEmail({
      variables: {
        patientId,
        emailId: email.id,
        emailAddress: email.emailAddress,
        description: email.description,
      },
    });
  };

  handleEmailSaved = (response: { data: emailEdit }, isPrimaryUpdatedToTrue: boolean) => {
    if (response.data.emailEdit) {
      this.props.onSaved(response.data.emailEdit, isPrimaryUpdatedToTrue);
    }
  };

  render() {
    const { email, isVisible, isPrimary, closePopup } = this.props;

    return (
      <EmailModal
        isVisible={isVisible}
        isPrimary={isPrimary}
        email={email}
        saveEmail={this.editEmail}
        onSaved={this.handleEmailSaved}
        closePopup={closePopup}
        titleMessageId="email.editEmail"
      />
    );
  }
}

export default compose(
  graphql(editEmailGraphql, {
    name: 'editEmail',
  }),
  graphql(editPatientInfoGraphql, {
    name: 'editPatientInfo',
  }),
)(EditEmailModal) as React.ComponentClass<IProps>;
