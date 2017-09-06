import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { DOB_FORMAT } from '../config';
import * as editPatientMutation from '../graphql/queries/patient-edit-mutation.graphql';
import { patientEditMutationVariables, ShortPatientFragment } from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import PatientContactForm, { IState as IPatientContactState } from '../shared/patient-contact-form';
import PatientDemographicsForm, {
  IState as IPatientDemographicsState,
  IUpdatedField,
} from '../shared/patient-demographics-form';
import PatientInsuranceForm, {
  IState as IPatientInsuranceState,
} from '../shared/patient-insurance-form';
import * as styles from './css/patient-info.css';

export interface IOptions {
  variables: patientEditMutationVariables;
}

export interface IProps {
  loading?: boolean;
  error?: string;
  patientId: string;
  patient?: ShortPatientFragment;
  updatePatientInfo: (options: IOptions) => { data: { patientEdit: ShortPatientFragment } };
}

export type IState = IPatientDemographicsState &
  IPatientContactState &
  IPatientInsuranceState & {
    saveLoading?: boolean;
    saveError?: boolean;
    saveSuccess?: boolean;
    clearSaveSuccessTimeout?: number;
  };

const SAVE_SUCCESS_TIMEOUT_MILLISECONDS = 2000;

export class PatientInfo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      language: '',
      race: '',
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
    };

    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.clearSaveSuccess = this.clearSaveSuccess.bind(this);
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { patient } = nextProps;

    if (patient) {
      const { dateOfBirth } = patient;

      this.setState(() => ({
        firstName: patient.firstName || '',
        middleName: patient.middleName || '',
        lastName: patient.lastName || '',
        dateOfBirth: dateOfBirth ? moment(dateOfBirth || '0', DOB_FORMAT).format('YYYY-MM-DD') : '',
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
      }));
    }
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { fieldName, fieldValue } = updatedField;

    this.setState({ [fieldName as any]: fieldValue });
  }

  clearSaveSuccess() {
    const { clearSaveSuccessTimeout } = this.state;

    const resetSaveSuccess = () => this.setState(() => ({ saveSuccess: false }));

    if (clearSaveSuccessTimeout) {
      clearTimeout(clearSaveSuccessTimeout);
    }

    this.setState(() => ({
      /* tslint:disable:no-string-based-set-timeout */
      clearSaveSuccessTimeout: setTimeout(resetSaveSuccess, SAVE_SUCCESS_TIMEOUT_MILLISECONDS),
      /* tslint:enable:no-string-based-set-timeout */
    }));
  }

  async onClickSave() {
    const { patientId, updatePatientInfo, loading, error } = this.props;
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

    if (!loading && !error && !saveLoading) {
      this.setState(() => ({ saveSuccess: false, saveLoading: true, saveError: undefined }));
      try {
        // TODO: Make this less annoying
        await updatePatientInfo({
          variables: {
            patientId,
            firstName: firstName ? firstName : null,
            middleName: middleName ? middleName : null,
            lastName: lastName ? lastName : null,
            gender: gender ? gender : null,
            dateOfBirth: moment(dateOfBirth, 'YYYY-MM-DD').format(DOB_FORMAT),
            zip: zip ? Number(zip) : null,
            language: language ? language : null,
            consentToCall: consentToCall === 'true',
            consentToText: consentToText === 'true',
          },
        });
        this.setState(() => ({ saveSuccess: true }));
        this.clearSaveSuccess();
      } catch (err) {
        this.setState(() => ({ saveError: err.message }));
      }

      this.setState(() => ({ saveLoading: false }));
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

    const saveButtonStyles = classNames(styles.button, styles.saveButton, {
      [styles.inactiveButton]: saveLoading || loading || !!error,
    });

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
            <FormattedMessage id='patientInfo.jumpTo'>
              {(message: string) => <div className={sortSearchStyles.sortLabel}>{message}</div>}
            </FormattedMessage>
            <div className={sortSearchStyles.sortDropdown}>
              <select value='Demographic info'>
                <option value='Demographic info'>Demographic info</option>
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
            <div className={saveButtonStyles} onClick={this.onClickSave}>
              <FormattedMessage id='patientInfo.saveChanges'>
                {(message: string) => <span>{message}</span>}
              </FormattedMessage>
            </div>
          </div>
        </div>
        <div className={styles.infoPanel}>
          <div className={styles.info}>
            <div className={styles.section}>
              <FormattedMessage id='patientInfo.demographicInfo'>
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
              <FormattedMessage id='patientInfo.contactInfo'>
                {(message: string) => <div className={styles.sectionTitle}>{message}</div>}
              </FormattedMessage>
              <PatientContactForm
                fields={{ email, homePhone, mobilePhone, consentToCall, consentToText }}
                onFieldUpdate={this.onFieldUpdate}
              />
            </div>
            <div className={styles.section}>
              <FormattedMessage id='patientInfo.insuranceInfo'>
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

export default (compose as any)(graphql(editPatientMutation as any, { name: 'updatePatientInfo' }))(
  PatientInfo,
);
