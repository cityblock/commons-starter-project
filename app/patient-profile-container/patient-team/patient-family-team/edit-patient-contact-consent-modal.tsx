import React from 'react';
import { graphql } from 'react-apollo';
import getPatientContactsQuery from '../../../graphql/queries/get-patient-contacts.graphql';
import editPatientContactMutationGraphql from '../../../graphql/queries/patient-contact-edit-mutation.graphql';
import {
  patientContactEdit,
  patientContactEditVariables,
  FullPatientContact,
} from '../../../graphql/types';
import ConsentModal from '../consent-modal';
import { getConsentSettingsObject, IConsentSettings } from '../helpers/consent-helpers';

interface IProps {
  patientContact: FullPatientContact;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editPatientContactMutation: (
    options: { variables: patientContactEditVariables },
  ) => { data: patientContactEdit };
}

type allProps = IProps & IGraphqlProps;

export class EditPatientContactConsentModal extends React.Component<allProps> {
  editPatientContact = async (consentSettings: IConsentSettings) => {
    const { editPatientContactMutation, patientContact } = this.props;

    return editPatientContactMutation({
      variables: {
        ...consentSettings,
        patientContactId: patientContact.id,
      },
    });
  };

  render() {
    const { patientContact, isVisible, closePopup } = this.props;
    const consentSettings = getConsentSettingsObject(patientContact);

    return (
      <ConsentModal
        consenterId={patientContact.id}
        isVisible={isVisible}
        consentSettings={consentSettings}
        saveConsentSettings={this.editPatientContact}
        closePopup={closePopup}
      />
    );
  }
}

export default graphql<any>(editPatientContactMutationGraphql, {
  name: 'editPatientContactMutation',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: getPatientContactsQuery,
        variables: {
          patientId: props.patientId,
        },
      },
    ],
  }),
})(EditPatientContactConsentModal) as React.ComponentClass<IProps>;
