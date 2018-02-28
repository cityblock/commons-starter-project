import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as editEmailMutationGraphql from '../../../graphql/queries/email-edit-mutation.graphql';
import * as editPatientInfoMutationGraphql from '../../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  emailEditMutation,
  emailEditMutationVariables,
  patientInfoEditMutation,
  patientInfoEditMutationVariables,
} from '../../../graphql/types';
import EmailModal, { IEmail, ISavedEmail } from '../../../shared/email-modal/email-modal';

interface IProps {
  onSaved: (email: ISavedEmail) => void;
  patientId: string;
  patientInfoId: string;
  email?: ISavedEmail | null;
  isVisible: boolean;
  isPrimary?: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editEmailMutation: (
    options: { variables: emailEditMutationVariables },
  ) => { data: emailEditMutation };
  editPatientInfoMutation: (
    options: { variables: patientInfoEditMutationVariables },
  ) => { data: patientInfoEditMutation };
}

type allProps = IProps & IGraphqlProps;

export class EditEmailModal extends React.Component<allProps> {
  editEmail = async (email: IEmail, updatedIsPrimary: boolean) => {
    if (!email.id || !email.emailAddress) {
      return;
    }

    const {
      editEmailMutation,
      editPatientInfoMutation,
      patientId,
      isPrimary,
      patientInfoId,
    } = this.props;
    if (updatedIsPrimary !== isPrimary) {
      await editPatientInfoMutation({
        variables: {
          patientInfoId,
          primaryEmailId: email.id,
        },
      });
    }

    return editEmailMutation({
      variables: {
        patientId,
        emailId: email.id,
        emailAddress: email.emailAddress,
        description: email.description,
      },
    });
  };

  handleEmailSaved = (response: { data: emailEditMutation }) => {
    if (response.data.emailEdit) {
      this.props.onSaved(response.data.emailEdit);
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
  graphql<IGraphqlProps, IProps, allProps>(editEmailMutationGraphql as any, {
    name: 'editEmailMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(editPatientInfoMutationGraphql as any, {
    name: 'editPatientInfoMutation',
  }),
)(EditEmailModal);