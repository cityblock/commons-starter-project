import { get } from 'lodash';
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
  sexAtBirth?: getPatientQuery['patient']['patientInfo']['sexAtBirth'];
  hasMolst?: getPatientQuery['patient']['patientInfo']['hasMolst'];
  hasHealthcareProxy?: getPatientQuery['patient']['patientInfo']['hasHealthcareProxy'];
  hasDeclinedPhotoUpload?: getPatientQuery['patient']['patientInfo']['hasDeclinedPhotoUpload'];
}

interface IState {
  isSaving?: boolean;
  saveError: string | null;
  saveSuccess?: boolean;
}

type allState = IState & IEditableFieldState;

function checkDefined<T>(preferred?: T | null, secondary?: T | null) {
  return preferred === undefined ? secondary : preferred;
}

export class PatientInfo extends React.Component<allProps, allState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      saveError: null,
    };
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
      sexAtBirth,
      hasMolst,
      hasHealthcareProxy,
      hasDeclinedPhotoUpload,
    } = this.state;

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
        primaryAddress: checkDefined<ISavedAddress>(primaryAddress, patientInfo.primaryAddress),
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
        primaryEmail: checkDefined<ISavedEmail>(primaryEmail, patientInfo.primaryEmail),
        canReceiveCalls: checkDefined<boolean>(canReceiveCalls, patientInfo.canReceiveCalls),
        canReceiveTexts: checkDefined<boolean>(canReceiveTexts, patientInfo.canReceiveTexts),
        preferredContactMethod: preferredContactMethod || patientInfo.preferredContactMethod,
        primaryPhone: checkDefined<ISavedPhone>(primaryPhone, patientInfo.primaryPhone),
      },
      advanced: {
        patientId: id,
        patientInfoId: patientInfo.id,
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
          language,
          preferredContactMethod,
          canReceiveCalls,
          canReceiveTexts,
          hasEmail,
          isMarginallyHoused,
          preferredName,
          sexAtBirth,
          hasMolst,
          hasHealthcareProxy,
          hasDeclinedPhotoUpload,
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

    const hasMolst = checkDefined(this.state.hasMolst, get(patient, 'patientInfo.hasMolst'));
    const hasHealthcareProxy = checkDefined(
      this.state.hasHealthcareProxy,
      get(patient, 'patientInfo.hasHealthcareProxy'),
    );
    const documents = isDocuments ? (
      <PatientDocuments
        patientId={match.params.patientId}
        hasMolst={hasMolst}
        hasHealthcareProxy={hasHealthcareProxy}
      />
    ) : null;
    const saveButton = !isDocuments ? this.renderSaveButton() : null;

    return (
      <div className={styles.container}>
        <UnderlineTabs className={styles.stickyTop}>
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
    options: {
      refetchQueries: ['getPatientComputedPatientStatus', 'getPatient'],
    },
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
