import React from 'react';
import { graphql } from 'react-apollo';
import createEmailGraphql from '../../../graphql/queries/email-create-for-patient-mutation.graphql';
import { emailCreateForPatient, emailCreateForPatientVariables } from '../../../graphql/types';
import EmailModal, { IEmail, ISavedEmail } from '../../../shared/email-modal/email-modal';

interface IProps {
  onSaved: (email: ISavedEmail) => void;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
  isPrimary?: boolean;
}

interface IGraphqlProps {
  createEmail: (
    options: { variables: emailCreateForPatientVariables },
  ) => { data: emailCreateForPatient };
}

type allProps = IProps & IGraphqlProps;

export class CreateEmailModal extends React.Component<allProps> {
  createEmail = async (email: IEmail) => {
    if (email.id || !email.emailAddress) {
      return;
    }

    const { createEmail, patientId, isPrimary } = this.props;
    return createEmail({
      variables: {
        patientId,
        description: email.description,
        emailAddress: email.emailAddress,
        isPrimary,
      },
    });
  };

  handleEmailSaved = (response: { data: emailCreateForPatient }) => {
    if (response.data.emailCreateForPatient) {
      this.props.onSaved(response.data.emailCreateForPatient);
    }
  };

  render() {
    const { isVisible, closePopup, isPrimary } = this.props;
    const titleMessageId = isPrimary ? 'email.addPrimary' : 'email.addAdditional';

    return (
      <EmailModal
        isVisible={isVisible}
        saveEmail={this.createEmail}
        onSaved={this.handleEmailSaved}
        closePopup={closePopup}
        titleMessageId={titleMessageId}
      />
    );
  }
}

export default graphql<any>(createEmailGraphql, {
  name: 'createEmail',
})(CreateEmailModal) as React.ComponentClass<IProps>;
