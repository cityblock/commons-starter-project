import { ApolloError } from 'apollo-client';
import { get, pick } from 'lodash';
import { Fragment } from 'react';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router';
import patientComputedPatientStatusGraphql from '../../graphql/queries/get-patient-computed-patient-status.graphql';
import patientGraphql from '../../graphql/queries/get-patient.graphql';
import editPatientInfoGraphql from '../../graphql/queries/patient-info-edit-mutation.graphql';
import { getPatient, patientInfoEdit, patientInfoEditVariables } from '../../graphql/types';
import { ISavedAddress } from '../../shared/address-modal/address-modal';
import { ISavedEmail } from '../../shared/email-modal/email-modal';
import ErrorComponent from '../../shared/error-component/error-component';
import Button from '../../shared/library/button/button';
import Icon from '../../shared/library/icon/icon';
import Text from '../../shared/library/text/text';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import { ISavedPhone } from '../../shared/phone-modal/phone-modal';
import styles from './css/patient-info.css';
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
  editPatientInfo: (options: { variables: patientInfoEditVariables }) => { data: patientInfoEdit };
  patient?: getPatient['patient'];
  loading?: boolean;
  error: ApolloError | null;
}

type allProps = IProps & IGraphqlProps;

export interface IEditableFieldState {
  gender?: getPatient['patient']['patientInfo']['gender'];
  genderFreeText?: getPatient['patient']['patientInfo']['genderFreeText'];
  transgender?: getPatient['patient']['patientInfo']['transgender'];
  maritalStatus?: getPatient['patient']['patientInfo']['maritalStatus'];
  language?: getPatient['patient']['patientInfo']['language'];
  primaryAddress?: ISavedAddress | null;
  hasEmail?: getPatient['patient']['patientInfo']['hasEmail'];
  primaryEmail?: ISavedEmail | null;
  primaryPhone?: ISavedPhone | null;
  flags?: getPatient['patient']['patientDataFlags'];
  verifiedAt?: getPatient['patient']['coreIdentityVerifiedAt'];
  canReceiveCalls?: getPatient['patient']['patientInfo']['canReceiveCalls'];
  preferredContactMethod?: getPatient['patient']['patientInfo']['preferredContactMethod'];
  preferredContactTime?: getPatient['patient']['patientInfo']['preferredContactTime'];
  isMarginallyHoused?: getPatient['patient']['patientInfo']['isMarginallyHoused'];
  preferredName?: getPatient['patient']['patientInfo']['preferredName'];
  hasMolst?: getPatient['patient']['patientInfo']['hasMolst'];
  hasHealthcareProxy?: getPatient['patient']['patientInfo']['hasHealthcareProxy'];
  hasDeclinedPhotoUpload?: getPatient['patient']['patientInfo']['hasDeclinedPhotoUpload'];
  isWhite?: getPatient['patient']['patientInfo']['isWhite'];
  isBlack?: getPatient['patient']['patientInfo']['isBlack'];
  isAmericanIndianAlaskan?: getPatient['patient']['patientInfo']['isAmericanIndianAlaskan'];
  isAsian?: getPatient['patient']['patientInfo']['isAsian'];
  isHawaiianPacific?: getPatient['patient']['patientInfo']['isHawaiianPacific'];
  isOtherRace?: getPatient['patient']['patientInfo']['isOtherRace'];
  isHispanic?: getPatient['patient']['patientInfo']['isHispanic'];
  raceFreeText?: getPatient['patient']['patientInfo']['raceFreeText'];
}

interface IState {
  isSaving?: boolean;
  saveError: string | null;
  saveSuccess?: boolean;
  hasUnsavedChanges: boolean;
  isUploadModalVisible: boolean;
}

type allState = IState & IEditableFieldState;

function checkDefined<T>(preferred: T | undefined | null, secondary: T | null) {
  return preferred === undefined ? secondary : preferred;
}

export class PatientInfo extends React.Component<allProps, allState> {
  state: allState = {
    saveError: null,
    hasUnsavedChanges: false,
    isUploadModalVisible: false,
  };

  getBasicInfoFields(patientInfo: getPatient['patient']['patientInfo']) {
    const {
      language,
      gender,
      genderFreeText,
      transgender,
      maritalStatus,
      primaryAddress,
      isMarginallyHoused,
      preferredName,
      isWhite,
      isBlack,
      isAmericanIndianAlaskan,
      isAsian,
      isHawaiianPacific,
      isOtherRace,
      isHispanic,
      raceFreeText,
    } = this.state;

    return {
      gender: gender || patientInfo.gender,
      genderFreeText: genderFreeText || patientInfo.genderFreeText,
      transgender: transgender || patientInfo.transgender,
      maritalStatus: maritalStatus || patientInfo.maritalStatus,
      language: language || patientInfo.language,
      primaryAddress: checkDefined<ISavedAddress>(primaryAddress, patientInfo.primaryAddress),
      isMarginallyHoused: checkDefined<boolean>(isMarginallyHoused, patientInfo.isMarginallyHoused),
      preferredName: checkDefined<string>(preferredName, patientInfo.preferredName),
      isWhite: checkDefined<boolean>(isWhite, patientInfo.isWhite),
      isBlack: checkDefined<boolean>(isBlack, patientInfo.isBlack),
      isAmericanIndianAlaskan: checkDefined<boolean>(
        isAmericanIndianAlaskan,
        patientInfo.isAmericanIndianAlaskan,
      ),
      isAsian: checkDefined<boolean>(isAsian, patientInfo.isAsian),
      isHawaiianPacific: checkDefined<boolean>(isHawaiianPacific, patientInfo.isHawaiianPacific),
      isOtherRace: checkDefined<boolean>(isOtherRace, patientInfo.isOtherRace),
      isHispanic: checkDefined<boolean>(isHispanic, patientInfo.isHispanic),
      raceFreeText: raceFreeText || patientInfo.raceFreeText,
    };
  }

  getCoreFields(patient: getPatient['patient']) {
    const { patientDataFlags, coreIdentityVerifiedAt } = patient;
    const { flags, verifiedAt } = this.state;
    const { glassBreakId } = this.props;

    return {
      firstName: patient.firstName,
      lastName: patient.lastName,
      middleName: patient.middleName,
      cityblockId: patient.cityblockId,
      dateOfBirth: patient.dateOfBirth,
      ssnEnd: patient.ssnEnd,
      patientDataFlags: flags || patientDataFlags,
      coreIdentityVerifiedAt: verifiedAt || coreIdentityVerifiedAt,
      glassBreakId,
      nmi: patient.nmi,
      mrn: patient.mrn,
      memberId: patient.memberId,
    };
  }

  getPatientFields(patient: getPatient['patient']): IDemographics {
    const { id, patientDataFlags, patientInfo } = patient;
    const {
      primaryEmail,
      primaryPhone,
      flags,
      hasEmail,
      canReceiveCalls,
      preferredContactMethod,
      preferredContactTime,
      hasMolst,
      hasHealthcareProxy,
      hasDeclinedPhotoUpload,
    } = this.state;

    return {
      patientId: id,
      patientInfoId: patientInfo.id,
      core: this.getCoreFields(patient),
      basic: this.getBasicInfoFields(patientInfo),
      contact: {
        hasEmail: checkDefined<boolean>(hasEmail, patientInfo.hasEmail),
        primaryEmail: checkDefined<ISavedEmail>(primaryEmail, patientInfo.primaryEmail),
        canReceiveCalls: checkDefined<boolean>(canReceiveCalls, patientInfo.canReceiveCalls),
        preferredContactMethod: preferredContactMethod || patientInfo.preferredContactMethod,
        preferredContactTime: preferredContactTime || patientInfo.preferredContactTime,
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
    const { patient, editPatientInfo } = this.props;
    if (!patient) {
      return;
    }
    this.setState({ isSaving: true });

    const variables = pick(this.state, [
      'language',
      'gender',
      'genderFreeText',
      'transgender',
      'maritalStatus',
      'preferredContactMethod',
      'preferredContactTime',
      'canReceiveCalls',
      'hasEmail',
      'isMarginallyHoused',
      'preferredName',
      'hasMolst',
      'hasHealthcareProxy',
      'hasDeclinedPhotoUpload',
      'isBlack',
      'isWhite',
      'isAsian',
      'isAmericanIndianAlaskan',
      'isHawaiianPacific',
      'isOtherRace',
      'isHispanic',
      'raceFreeText',
    ]) as patientInfoEditVariables;
    variables.patientInfoId = patient.patientInfo.id;

    try {
      await editPatientInfo({ variables });

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
        <Text messageId="patientInfo.saveError" color="red" size="medium" />
        <Text
          color="gray"
          size="medium"
          messageId="patientInfo.tryAgain"
          className={styles.saveError}
        />
      </div>
    ) : null;

    const successMessage = saveSuccess ? (
      <div className={styles.saveMessage}>
        <Text messageId="patientInfo.saveSuccess" color="gray" size="medium" />
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
            patientDemographics={this.getPatientFields(patient)}
            patient={patient}
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
  graphql(editPatientInfoGraphql, {
    name: 'editPatientInfo',
    options: (props: IProps) => ({
      refetchQueries: [
        {
          query: patientComputedPatientStatusGraphql,
          variables: {
            patientId: props.match.params.patientId,
          },
        },
        {
          query: patientGraphql,
          variables: {
            patientId: props.match.params.patientId,
          },
        },
      ],
    }),
  }),
  graphql(patientGraphql, {
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
