import { ApolloError } from 'apollo-client';
import { get } from 'lodash';
import * as React from 'react';
import { Fragment } from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router';
import * as patientQuery from '../../graphql/queries/get-patient.graphql';
import * as editPatientInfoMutationGraphql from '../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  getPatientQuery,
  patientInfoEditMutation,
  patientInfoEditMutationVariables,
} from '../../graphql/types';
import { ISavedAddress } from '../../shared/address-modal/address-modal';
import { ISavedEmail } from '../../shared/email-modal/email-modal';
import ErrorComponent from '../../shared/error-component/error-component';
import Button from '../../shared/library/button/button';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import { ISavedPhone } from '../../shared/phone-modal/phone-modal';
import * as styles from './css/patient-info.css';
import PatientDocuments from './documents/patient-documents';
import PatientDemographics, { IDemographics } from './patient-demographics';

export type SelectableTabs = 'demographics' | 'documents';
const SAVE_SUCCESS_TIMEOUT_MILLISECONDS = 2000;

interface IProps {
  match: {
    params: {
      patientId: string;
      subTab?: SelectableTabs;
    };
  };
  glassBreakId?: string;
}

interface IGraphqlProps {
  editPatientInfoMutation: (
    options: { variables: patientInfoEditMutationVariables },
  ) => { data: patientInfoEditMutation };
  patient?: getPatientQuery['patient'];
  loading?: boolean;
  error: ApolloError | null;
}

type allProps = IProps & IGraphqlProps;

export interface IEditableFieldState {
  gender?: getPatientQuery['patient']['patientInfo']['gender'];
  genderFreeText?: getPatientQuery['patient']['patientInfo']['genderFreeText'];
  transgender?: getPatientQuery['patient']['patientInfo']['transgender'];
  maritalStatus?: getPatientQuery['patient']['patientInfo']['maritalStatus'];
  language?: getPatientQuery['patient']['patientInfo']['language'];
  primaryAddress?: ISavedAddress | null;
  hasEmail?: getPatientQuery['patient']['patientInfo']['hasEmail'];
  primaryEmail?: ISavedEmail | null;
  primaryPhone?: ISavedPhone | null;
  flags?: getPatientQuery['patient']['patientDataFlags'];
  verifiedAt?: getPatientQuery['patient']['coreIdentityVerifiedAt'];
  canReceiveTexts?: getPatientQuery['patient']['patientInfo']['canReceiveTexts'];
  canReceiveCalls?: getPatientQuery['patient']['patientInfo']['canReceiveCalls'];
  preferredContactMethod?: getPatientQuery['patient']['patientInfo']['preferredContactMethod'];
  isMarginallyHoused?: getPatientQuery['patient']['patientInfo']['isMarginallyHoused'];
  preferredName?: getPatientQuery['patient']['patientInfo']['preferredName'];
  hasMolst?: getPatientQuery['patient']['patientInfo']['hasMolst'];
  hasHealthcareProxy?: getPatientQuery['patient']['patientInfo']['hasHealthcareProxy'];
  hasDeclinedPhotoUpload?: getPatientQuery['patient']['patientInfo']['hasDeclinedPhotoUpload'];
}

interface IState {
  isSaving?: boolean;
  saveError: string | null;
  saveSuccess?: boolean;
  hasUnsavedChanges: boolean;
  isUploadModalVisible: boolean;
}

type allState = IState & IEditableFieldState;

function checkDefined<T>(preferred?: T | null, secondary?: T | null) {
  return preferred === undefined ? secondary : preferred;
}

export class PatientInfo extends React.Component<allProps, allState> {
  state: allState = {
    saveError: null,
    hasUnsavedChanges: false,
    isUploadModalVisible: false,
  };

  getPatientFields(patient: getPatientQuery['patient']): IDemographics {
    const {
      id,
      lastName,
      middleName,
      firstName,
      dateOfBirth,
      ssnEnd,
      patientDataFlags,
      patientInfo,
      coreIdentityVerifiedAt,
      cityblockId,
      nmi,
      mrn,
    } = patient;
    const {
      language,
      gender,
      genderFreeText,
      transgender,
      maritalStatus,
      primaryAddress,
      primaryEmail,
      primaryPhone,
      flags,
      verifiedAt,
      hasEmail,
      canReceiveCalls,
      canReceiveTexts,
      preferredContactMethod,
      isMarginallyHoused,
      preferredName,
      hasMolst,
      hasHealthcareProxy,
      hasDeclinedPhotoUpload,
    } = this.state;
    const { glassBreakId } = this.props;

    return {
      patientId: id,
      patientInfoId: patientInfo.id,
      core: {
        firstName,
        lastName,
        middleName,
        cityblockId,
        dateOfBirth,
        ssnEnd,
        patientDataFlags: flags || patientDataFlags,
        coreIdentityVerifiedAt: verifiedAt || coreIdentityVerifiedAt,
        glassBreakId,
        nmi,
        mrn,
      },
      basic: {
        gender: gender || patientInfo.gender,
        genderFreeText: genderFreeText || patientInfo.genderFreeText,
        transgender: transgender || patientInfo.transgender,
        maritalStatus: maritalStatus || patientInfo.maritalStatus,
        language: language || patientInfo.language,
        primaryAddress: checkDefined<ISavedAddress>(primaryAddress, patientInfo.primaryAddress),
        isMarginallyHoused: checkDefined<boolean>(
          isMarginallyHoused,
          patientInfo.isMarginallyHoused,
        ),
        preferredName: checkDefined<string>(preferredName, patientInfo.preferredName),
      },
      contact: {
        hasEmail: checkDefined<boolean>(hasEmail, patientInfo.hasEmail),
        primaryEmail: checkDefined<ISavedEmail>(primaryEmail, patientInfo.primaryEmail),
        canReceiveCalls: checkDefined<boolean>(canReceiveCalls, patientInfo.canReceiveCalls),
        canReceiveTexts: checkDefined<boolean>(canReceiveTexts, patientInfo.canReceiveTexts),
        preferredContactMethod: preferredContactMethod || patientInfo.preferredContactMethod,
        primaryPhone: checkDefined<ISavedPhone>(primaryPhone, patientInfo.primaryPhone),
      },
      plan: {
        patientDataFlags: flags || patientDataFlags,
      },
      advanced: {
        hasMolst: checkDefined<boolean>(hasMolst, patientInfo.hasMolst),
        hasHealthcareProxy: checkDefined<boolean>(
          hasHealthcareProxy,
          patientInfo.hasHealthcareProxy,
        ),
      },
      photo: {
        hasDeclinedPhotoUpload: checkDefined<boolean>(
          hasDeclinedPhotoUpload,
          patientInfo.hasDeclinedPhotoUpload,
        ),
        hasUploadedPhoto: !!patientInfo.hasUploadedPhoto,
      },
    };
  }

  resetSaveSuccess = () => this.setState({ saveSuccess: false });

  handleSaveClick = async () => {
    const { patient, editPatientInfoMutation } = this.props;
    const {
      language,
      gender,
      genderFreeText,
      transgender,
      maritalStatus,
      preferredContactMethod,
      canReceiveCalls,
      canReceiveTexts,
      hasEmail,
      isMarginallyHoused,
      preferredName,
      hasMolst,
      hasHealthcareProxy,
      hasDeclinedPhotoUpload,
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
          genderFreeText,
          transgender,
          maritalStatus,
          language,
          preferredContactMethod,
          canReceiveCalls,
          canReceiveTexts,
          hasEmail,
          isMarginallyHoused,
          preferredName,
          hasMolst,
          hasHealthcareProxy,
          hasDeclinedPhotoUpload,
        },
      });

      this.setState({ saveSuccess: true, isSaving: false, hasUnsavedChanges: false });
      setTimeout(this.resetSaveSuccess, SAVE_SUCCESS_TIMEOUT_MILLISECONDS);
    } catch (err) {
      this.setState({ saveError: err.message, isSaving: false });
    }
  };

  handleUploadClick = () => {
    this.setState({ isUploadModalVisible: true });
  };

  handleCloseUploadModal = () => {
    this.setState({ isUploadModalVisible: false });
  };

  handleFieldChange = (changedValues: IEditableFieldState) => {
    this.setState({ ...changedValues, hasUnsavedChanges: true });
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

  renderUploadButton() {
    return <Button messageId="patientInfo.uploadDocument" onClick={this.handleUploadClick} />;
  }

  render(): JSX.Element {
    const { match, patient, error } = this.props;
    const subTab = match.params.subTab;
    const routeBase = `/patients/${match.params.patientId}/member-info`;
    const { hasUnsavedChanges, isUploadModalVisible } = this.state;

    if (error) {
      return <ErrorComponent error={error} />;
    }

    const isDocuments = subTab === 'documents';

    // This Prompt triggers a save modal that is defined at the root of App on BrowserRouter
    const demographics =
      !isDocuments && patient ? (
        <Fragment>
          <FormattedMessage id="patientInfo.unsavedChanges">
            {(message: string) => <Prompt when={hasUnsavedChanges} message={message} />}
          </FormattedMessage>
          <PatientDemographics
            routeBase={routeBase}
            patient={this.getPatientFields(patient)}
            onChange={this.handleFieldChange}
          />
        </Fragment>
      ) : null;

    const hasMolst = checkDefined(this.state.hasMolst, get(patient, 'patientInfo.hasMolst'));
    const hasHealthcareProxy = checkDefined(
      this.state.hasHealthcareProxy,
      get(patient, 'patientInfo.hasHealthcareProxy'),
    );
    const documents = isDocuments ? (
      <PatientDocuments
        closePopup={this.handleCloseUploadModal}
        patientId={match.params.patientId}
        hasMolst={hasMolst}
        hasHealthcareProxy={hasHealthcareProxy}
        isModalVisible={isUploadModalVisible}
      />
    ) : null;
    const button = isDocuments ? this.renderUploadButton() : this.renderSaveButton();

    return (
      <React.Fragment>
        <UnderlineTabs className={styles.navBar}>
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
          {button}
        </UnderlineTabs>
        <div className={styles.body}>
          {demographics}
          {documents}
        </div>
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(editPatientInfoMutationGraphql as any, {
    name: 'editPatientInfoMutation',
    options: {
      refetchQueries: ['getPatientComputedPatientStatus', 'getPatient'],
    },
  }),
  graphql(patientQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.match.params.patientId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patient: data ? (data as any).patient : null,
    }),
  }),
)(PatientInfo) as React.ComponentClass<IProps>;
