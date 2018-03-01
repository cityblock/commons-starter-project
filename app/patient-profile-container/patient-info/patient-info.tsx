import { filter, get, isNil } from 'lodash-es';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientQuery from '../../graphql/queries/get-patient.graphql';
import * as editPatientInfoMutationGraphql from '../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  getPatientQuery,
  patientInfoEditMutation,
  patientInfoEditMutationVariables,
} from '../../graphql/types';
import { ISavedAddress } from '../../shared/address-modal/address-modal';
import { ISavedEmail } from '../../shared/email-modal/email-modal';
import Button from '../../shared/library/button/button';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import { ISavedPhone } from '../../shared/phone-modal/phone-modal';
import * as styles from './css/patient-info.css';
import PatientDemographics, { IDemographics } from './patient-demographics';
import PatientDocuments from './patient-documents';

export type SelectableTabs = 'demographics' | 'documents';
const SAVE_SUCCESS_TIMEOUT_MILLISECONDS = 2000;

interface IProps {
  match: {
    params: {
      patientId: string;
      subTab?: SelectableTabs;
    };
  };
}

interface IGraphqlProps {
  editPatientInfoMutation: (
    options: { variables: patientInfoEditMutationVariables },
  ) => { data: patientInfoEditMutation };
  patient?: getPatientQuery['patient'];
  loading?: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

export interface IEditableFieldState {
  gender?: getPatientQuery['patient']['patientInfo']['gender'];
  language?: getPatientQuery['patient']['patientInfo']['language'];
  primaryAddress?: ISavedAddress | null;
  addresses?: ISavedAddress[] | null;
  hasEmail?: getPatientQuery['patient']['patientInfo']['hasEmail'];
  primaryEmail?: ISavedEmail | null;
  emails?: ISavedEmail[] | null;
  primaryPhone?: ISavedPhone | null;
  phones?: ISavedPhone[] | null;
  flags?: getPatientQuery['patient']['patientDataFlags'];
  verifiedAt?: getPatientQuery['patient']['coreIdentityVerifiedAt'];
  canReceiveTexts?: getPatientQuery['patient']['patientInfo']['canReceiveTexts'];
  canReceiveCalls?: getPatientQuery['patient']['patientInfo']['canReceiveCalls'];
  preferredContactMethod?: getPatientQuery['patient']['patientInfo']['preferredContactMethod'];
  isMarginallyHoused?: getPatientQuery['patient']['patientInfo']['isMarginallyHoused'];
  preferredName?: getPatientQuery['patient']['patientInfo']['preferredName'];
  sexAtBirth?: getPatientQuery['patient']['patientInfo']['sexAtBirth'];
}

interface IState {
  isSaving?: boolean;
  saveError: string | null;
  saveSuccess?: boolean;
}

type allState = IState & IEditableFieldState;

function checkDefined<T>(preferred?: T | null, secondary?: T | null) {
  return isNil(preferred) ? secondary : preferred;
}

export class PatientInfo extends React.Component<allProps, allState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      saveError: null,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    if (!nextProps.patient) {
      return;
    }

    const {
      gender,
      language,
      primaryEmail,
      primaryAddress,
      primaryPhone,
    } = nextProps.patient.patientInfo;

    const oldPrimaryEmail = get(this.props, 'patient.patientInfo.primaryEmail');
    const oldPrimaryAddress = get(this.props, 'patient.patientInfo.primaryAddress');
    const oldPrimaryPhone = get(this.props, 'patient.patientInfo.primaryPhone');

    // if the primary address changed, swap it with addiitonal address in the addresses array
    let addresses = this.state.addresses;
    if (
      oldPrimaryAddress &&
      primaryAddress &&
      addresses &&
      oldPrimaryAddress.id !== primaryAddress.id
    ) {
      addresses = filter(addresses, address => address.id !== primaryAddress.id);
      addresses.push(oldPrimaryAddress);
    }

    // if the primary email changed, swap it with addiitonal email in the emails array
    let emails = this.state.emails;
    if (oldPrimaryEmail && primaryEmail && emails && oldPrimaryEmail.id !== primaryEmail.id) {
      emails = filter(emails, email => email.id !== primaryEmail.id);
      emails.push(oldPrimaryEmail);
    }

    // if the primary phone changed, swap it with addiitonal phone in the phones array
    let phones = this.state.phones;
    if (oldPrimaryPhone && primaryPhone && phones && oldPrimaryPhone.id !== primaryPhone.id) {
      phones = filter(phones, phone => phone.id !== primaryPhone.id);
      phones.push(oldPrimaryPhone);
    }

    this.setState({
      gender,
      language,
      primaryEmail,
      primaryAddress,
      addresses,
      emails,
    });
  }

  getPatientFields(patient: getPatientQuery['patient']): IDemographics {
    const {
      id,
      lastName,
      middleName,
      firstName,
      dateOfBirth,
      patientDataFlags,
      patientInfo,
      coreIdentityVerifiedAt,
    } = patient;
    const {
      language,
      gender,
      primaryAddress,
      addresses,
      primaryEmail,
      emails,
      primaryPhone,
      phones,
      flags,
      verifiedAt,
      hasEmail,
      canReceiveCalls,
      canReceiveTexts,
      preferredContactMethod,
      isMarginallyHoused,
      preferredName,
      sexAtBirth,
    } = this.state;

    // remove primary address to create list of additional addresses
    const savedAddresses =
      patientInfo.primaryAddress && patientInfo.addresses
        ? patientInfo.addresses.filter(address => address.id !== patientInfo.primaryAddress!.id)
        : [];

    // remove primary email to create list of additional emails
    const savedEmailAddresses =
      patientInfo.primaryEmail && patientInfo.emails
        ? patientInfo.emails.filter(email => email.id !== patientInfo.primaryEmail!.id)
        : [];

    // remove primary phone number to create list of additional phone numbers
    const savedPhoneAddresses =
      patientInfo.primaryPhone && patientInfo.phones
        ? patientInfo.phones.filter(phone => phone.id !== patientInfo.primaryPhone!.id)
        : [];

    return {
      core: {
        patientId: id,
        firstName,
        lastName,
        middleName,
        dateOfBirth,
        patientDataFlags: flags || patientDataFlags,
        coreIdentityVerifiedAt: verifiedAt || coreIdentityVerifiedAt,
      },
      basic: {
        patientId: id,
        patientInfoId: patientInfo.id,
        gender: gender || patientInfo.gender,
        language: language || patientInfo.language,
        primaryAddress: primaryAddress || patientInfo.primaryAddress,
        addresses: addresses || savedAddresses,
        isMarginallyHoused: checkDefined<boolean>(
          isMarginallyHoused,
          patientInfo.isMarginallyHoused,
        ),
        preferredName: checkDefined<string>(preferredName, patientInfo.preferredName),
        sexAtBirth: sexAtBirth || patientInfo.sexAtBirth,
      },
      contact: {
        patientId: id,
        patientInfoId: patientInfo.id,
        hasEmail: checkDefined<boolean>(hasEmail, patientInfo.hasEmail),
        primaryEmail: primaryEmail || patientInfo.primaryEmail,
        emails: emails || savedEmailAddresses,
        canReceiveCalls: checkDefined<boolean>(canReceiveCalls, patientInfo.canReceiveCalls),
        canReceiveTexts: checkDefined<boolean>(canReceiveTexts, patientInfo.canReceiveTexts),
        preferredContactMethod: preferredContactMethod || patientInfo.preferredContactMethod,
        primaryPhone: primaryPhone || patientInfo.primaryPhone,
        phones: phones || savedPhoneAddresses,
      },
    };
  }

  resetSaveSuccess = () => this.setState({ saveSuccess: false });

  handleSaveClick = async () => {
    const { patient, editPatientInfoMutation } = this.props;
    const {
      language,
      gender,
      preferredContactMethod,
      canReceiveCalls,
      canReceiveTexts,
      hasEmail,
      isMarginallyHoused,
      preferredName,
      sexAtBirth,
    } = this.state;
    if (!patient) {
      return;
    }
    this.setState({ isSaving: true });

    try {
      await editPatientInfoMutation({
        variables: {
          patientInfoId: patient.patientInfo.id,
          gender,
          language,
          preferredContactMethod,
          canReceiveCalls,
          canReceiveTexts,
          hasEmail,
          isMarginallyHoused,
          preferredName,
          sexAtBirth,
        },
      });

      this.setState({ saveSuccess: true, isSaving: false });
      setTimeout(this.resetSaveSuccess, SAVE_SUCCESS_TIMEOUT_MILLISECONDS);
    } catch (err) {
      this.setState({ saveError: err.message, isSaving: false });
    }
  };

  handleFieldChange = (changedValues: IEditableFieldState) => {
    this.setState(changedValues as any);
  };

  renderSaveButton() {
    const { loading } = this.props;
    const { isSaving, saveError, saveSuccess } = this.state;

    const errorComponent = saveError ? (
      <div className={styles.saveMessage}>
        <SmallText messageId="patientInfo.saveError" color="red" size="medium" />
        <SmallText
          color="gray"
          size="medium"
          messageId="patientInfo.tryAgain"
          className={styles.saveError}
        />
      </div>
    ) : null;

    const successMessage = saveSuccess ? (
      <div className={styles.saveMessage}>
        <SmallText messageId="patientInfo.saveSuccess" color="gray" size="medium" />
        <Icon name="checkCircle" className={styles.successIcon} />
      </div>
    ) : null;

    return (
      <div>
        {errorComponent}
        {successMessage}
        <Button
          messageId="patientInfo.save"
          onClick={this.handleSaveClick}
          disabled={isSaving || loading}
        />
      </div>
    );
  }

  render(): JSX.Element {
    const { match, patient } = this.props;
    const subTab = match.params.subTab;
    const routeBase = `/patients/${match.params.patientId}/member-info`;

    const isDocuments = subTab === 'documents';

    const demographics =
      !isDocuments && patient ? (
        <PatientDemographics
          routeBase={routeBase}
          patient={this.getPatientFields(patient)}
          onChange={this.handleFieldChange}
        />
      ) : null;

    const documents = isDocuments ? <PatientDocuments patientId={match.params.patientId} /> : null;
    const saveButton = !isDocuments ? this.renderSaveButton() : null;

    return (
      <div>
        <UnderlineTabs>
          <div>
            <UnderlineTab
              messageId="patientInfo.demographics"
              href={`${routeBase}/demographics`}
              selected={!isDocuments}
            />
            <UnderlineTab
              messageId="patientInfo.documents"
              href={`${routeBase}/documents`}
              selected={isDocuments}
            />
          </div>
          {saveButton}
        </UnderlineTabs>
        <div>
          {demographics}
          {documents}
        </div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(editPatientInfoMutationGraphql as any, {
    name: 'editPatientInfoMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.match.params.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patient: data ? (data as any).patient : null,
    }),
  }),
)(PatientInfo);
