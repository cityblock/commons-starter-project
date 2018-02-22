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
import Button from '../../shared/library/button/button';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import * as styles from './css/patient-info.css';
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

interface IState {
  gender: getPatientQuery['patient']['patientInfo']['gender'];
  language: getPatientQuery['patient']['patientInfo']['language'];
  primaryAddress?: ISavedAddress;
  addresses?: ISavedAddress[];
  flags?: getPatientQuery['patient']['patientDataFlags'];
  verifiedAt?: getPatientQuery['patient']['coreIdentityVerifiedAt'];
  isSaving?: boolean;
  saveError: string | null;
  saveSuccess?: boolean;
}

export class PatientInfo extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      language: null,
      gender: null,
      saveError: null,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    if (!nextProps.patient) {
      return;
    }

    const { gender, language } = nextProps.patient.patientInfo;

    this.setState({
      gender,
      language,
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
    const { language, gender, primaryAddress, addresses, flags, verifiedAt } = this.state;

    // remove primary address to create list of additional addresses
    const savedAddresses =
      patientInfo.primaryAddress && patientInfo.addresses
        ? patientInfo.addresses.filter(address => address.id !== patientInfo.primaryAddress!.id)
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
        gender: gender || patientInfo.gender,
        language: language || patientInfo.language,
        primaryAddress: primaryAddress || patientInfo.primaryAddress,
        addresses: addresses || savedAddresses,
      },
    };
  }

  resetSaveSuccess = () => this.setState({ saveSuccess: false });

  handleSaveClick = async () => {
    const { patient, editPatientInfoMutation } = this.props;
    const { language, gender } = this.state;
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
        },
      });

      this.setState({ saveSuccess: true, isSaving: false });
      setTimeout(this.resetSaveSuccess, SAVE_SUCCESS_TIMEOUT_MILLISECONDS);
    } catch (err) {
      this.setState({ saveError: err.message, isSaving: false });
    }
  };

  handleFieldChange = ({
    name,
    value,
  }: {
    name: string;
    value: string | boolean | object | null;
  }) => {
    this.setState({ [name as any]: value });
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
    const routeBase = `/patients/${match.params.patientId}/patientInfo`;

    const isDocuments = subTab === 'documents';

    const demographics =
      !isDocuments && patient ? (
        <PatientDemographics
          routeBase={routeBase}
          patient={this.getPatientFields(patient)}
          onChange={this.handleFieldChange}
        />
      ) : null;

    const documents = isDocuments ? <div /> : null;
    const saveButton = !isDocuments ? this.renderSaveButton() : null;

    return (
      <div>
        <UnderlineTabs>
          <div>
            <UnderlineTab
              messageId="patientInfo.demographics"
              href={`${routeBase}/active`}
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
