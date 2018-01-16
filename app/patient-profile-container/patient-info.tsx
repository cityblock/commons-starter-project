import * as classNames from 'classnames';
import { format } from 'date-fns';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { DOB_FORMAT } from '../config';
import * as patientQuery from '../graphql/queries/get-patient.graphql';
import * as editPatientMutationGraphql from '../graphql/queries/patient-edit-mutation.graphql';
import {
  getPatientQuery,
  patientEditMutation,
  patientEditMutationVariables,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import Button from '../shared/library/button/button';
import PatientContactForm, { IState as IPatientContactState } from '../shared/patient-contact-form';
import PatientDemographicsForm, {
  IState as IPatientDemographicsState,
} from '../shared/patient-demographics-form';
import PatientInsuranceForm, {
  IState as IPatientInsuranceState,
} from '../shared/patient-insurance-form';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/patient-info.css';

interface IOptions {
  variables: patientEditMutationVariables;
}

interface IProps {
  mutate?: any;
  match: {
    params: {
      patientId: string;
    };
  };
}

interface IGraphqlProps {
  updatePatientInfo: (options: IOptions) => { data: patientEditMutation };
  patient?: getPatientQuery['patient'];
  loading?: boolean;
  error: string | null;
}

type IState = IPatientDemographicsState &
  IPatientContactState &
  IPatientInsuranceState & {
    saveLoading?: boolean;
    saveError: boolean;
    saveSuccess?: boolean;
    clearSaveSuccessTimeout?: any; // Should be Timer
  };

type allProps = IProps & IGraphqlProps;

const SAVE_SUCCESS_TIMEOUT_MILLISECONDS = 2000;

export class PatientInfo extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      language: '',
      ssn: '',
      email: '',
      homePhone: '',
      mobilePhone: '',
      insuranceType: '',
      patientRelationshipToPolicyHolder: '',
      memberId: '',
      policyGroupNumber: '',
      issueDate: '',
      expirationDate: '',
      zip: '',
      consentToCall: '',
      consentToText: '',
      displayConsentToPhoneTextPopup: false,
      saveError: false,
    };

    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.clearSaveSuccess = this.clearSaveSuccess.bind(this);
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { patient } = nextProps;

    if (patient) {
      const { dateOfBirth } = patient;

      this.setState({
        firstName: patient.firstName || '',
        middleName: patient.middleName || '',
        lastName: patient.lastName || '',
        dateOfBirth: dateOfBirth ? format(new Date(dateOfBirth), 'YYYY-MM-DD') : '',
        gender: patient.gender || '',
        language: patient.language || '',
        email: '',
        homePhone: '',
        mobilePhone: '',
        zip: patient.zip || '',
        insuranceType: '',
        patientRelationshipToPolicyHolder: '',
        memberId: '',
        policyGroupNumber: '',
        issueDate: '',
        expirationDate: '',
        consentToText: patient.consentToText ? patient.consentToText.toString() : 'false',
        consentToCall: patient.consentToCall ? patient.consentToCall.toString() : 'false',
      });
    }
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { fieldName, fieldValue } = updatedField;

    this.setState({ [fieldName as any]: fieldValue });
  }

  clearSaveSuccess() {
    const { clearSaveSuccessTimeout } = this.state;

    const resetSaveSuccess = () => this.setState({ saveSuccess: false });

    if (clearSaveSuccessTimeout) {
      clearTimeout(clearSaveSuccessTimeout);
    }

    this.setState({
      /* tslint:disable:no-string-based-set-timeout */
      clearSaveSuccessTimeout: setTimeout(resetSaveSuccess, SAVE_SUCCESS_TIMEOUT_MILLISECONDS),
      /* tslint:enable:no-string-based-set-timeout */
    });
  }

  async onClickSave() {
    const { match, updatePatientInfo, loading, error } = this.props;
    const {
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      zip,
      language,
      consentToCall,
      consentToText,
      saveLoading,
    } = this.state;
    const patientId = match.params.patientId;
    if (!loading && !error && !saveLoading) {
      this.setState({ saveSuccess: false, saveLoading: true, saveError: false });
      try {
        // TODO: Make this less annoying
        await updatePatientInfo({
          variables: {
            patientId,
            firstName: firstName ? firstName : null,
            middleName: middleName ? middleName : null,
            lastName: lastName ? lastName : null,
            gender: gender ? gender : null,
            dateOfBirth: dateOfBirth ? format(new Date(dateOfBirth), DOB_FORMAT) : null,
            zip: zip ? zip : null,
            language: language ? language : null,
            consentToCall: consentToCall === 'true',
            consentToText: consentToText === 'true',
          },
        });
        this.setState({ saveSuccess: true });
        this.clearSaveSuccess();
      } catch (err) {
        this.setState({ saveError: err.message });
      }

      this.setState({ saveLoading: false });
    }
  }

  render() {
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      language,
      email,
      mobilePhone,
      homePhone,
      zip,
      consentToCall,
      consentToText,
      insuranceType,
      patientRelationshipToPolicyHolder,
      memberId,
      policyGroupNumber,
      issueDate,
      expirationDate,
      saveLoading,
      saveError,
      saveSuccess,
    } = this.state;

    const { loading, error } = this.props;

    const saveButtonErrorStyles = classNames(styles.saveButtonError, {
      [styles.hidden]: !saveError,
    });

    const saveButtonSuccessStyles = classNames(styles.saveButtonSuccess, {
      [styles.hidden]: !saveSuccess,
    });

    return (
      <div>
        <div className={sortSearchStyles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <FormattedMessage id="patientInfo.jumpTo">
              {(message: string) => <div className={sortSearchStyles.sortLabel}>{message}</div>}
            </FormattedMessage>
            <div className={sortSearchStyles.sortDropdown}>
              <select defaultValue="Demographic info">
                <option value="Demographic info">Demographic info</option>
              </select>
            </div>
          </div>
          <div className={styles.saveButtonGroup}>
            <div className={saveButtonErrorStyles}>
              <span className={styles.saveButtonErrorRedText}>Error saving. </span>Please try again.
            </div>
            <div className={saveButtonSuccessStyles}>
              <div className={styles.saveButtonSuccessLabel}>Changes saved.</div>
              <div className={styles.saveButtonSuccessIcon} />
            </div>
            <Button
              messageId="patientInfo.saveChanges"
              onClick={this.onClickSave}
              disabled={saveLoading || loading || !!error}
            />
          </div>
        </div>
        <div className={styles.infoPanel}>
          <div className={styles.info}>
            <div className={styles.section}>
              <FormattedMessage id="patientInfo.demographicInfo">
                {(message: string) => <div className={styles.sectionTitle}>{message}</div>}
              </FormattedMessage>
              <PatientDemographicsForm
                fields={{
                  firstName,
                  middleName,
                  lastName,
                  dateOfBirth,
                  gender,
                  language,
                  zip,
                }}
                onFieldUpdate={this.onFieldUpdate}
              />
            </div>
            <div className={styles.section}>
              <FormattedMessage id="patientInfo.contactInfo">
                {(message: string) => <div className={styles.sectionTitle}>{message}</div>}
              </FormattedMessage>
              <PatientContactForm
                fields={{ email, homePhone, mobilePhone, consentToCall, consentToText }}
                onFieldUpdate={this.onFieldUpdate}
              />
            </div>
            <div className={styles.section}>
              <FormattedMessage id="patientInfo.insuranceInfo">
                {(message: string) => <div className={styles.sectionTitle}>{message}</div>}
              </FormattedMessage>
              <PatientInsuranceForm
                fields={{
                  insuranceType,
                  patientRelationshipToPolicyHolder,
                  memberId,
                  policyGroupNumber,
                  issueDate,
                  expirationDate,
                }}
                onFieldUpdate={this.onFieldUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(editPatientMutationGraphql as any, {
    name: 'updatePatientInfo',
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
