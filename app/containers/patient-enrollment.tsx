import * as langs from 'langs';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { PatientPhotoUpload } from '../components/patient-photo-upload';
import PopupConsent from '../components/popup-consent';
import PopupPatientCreated from '../components/popup-patient-created';
import * as styles from '../css/components/patient-enrollment.css';
import * as loadingStyles from '../css/shared/loading-spinner.css';
import { getQuery } from '../graphql/helpers';
import {
  FullClinicFragment,
  PatientSetupMutationVariables,
  ShortPatientFragment,
} from '../graphql/types';
import ethnicities from '../util/ethnicity-codes';
import insuranceTypeOptions from '../util/insurance-type-options';
import races from '../util/race-codes';
import relationshipToPatientOptions from '../util/relationship-to-patient-options';

export interface IProps {
  createPatient: (
    options: { variables: PatientSetupMutationVariables },
  ) => { data: { patientSetup: ShortPatientFragment } };
  onSuccess: (patientId: string) => any;
  clinic: FullClinicFragment;
  clinicsLoading: boolean;
  clinicsError?: string;
}

export interface IState {
  displayConsentToPhoneTextPopup: boolean;
  loading: boolean;
  error?: string;
  createdPatient?: ShortPatientFragment;
  patient: {
    homeClinicId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    race: string;
    zip: string;
    ssn: string;
    language6392code: string;
    email: string;
    homePhone: string;
    mobilePhone: string;
    ethnicityCode: string;
    consentToText: string;
    consentToCall: string;
    preferredContactMethod: string;
  };
  insurance: {
    insuranceType: string;
    patientRelationshipToPolicyHolder: string;
    memberId: string;
    policyGroupNumber: string;
    issueDate: string;
    expirationDate: string;
  };
}

function formatDate(date: string) {
  return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
}

class PatientEnrolementContainer extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.updatePatient = this.updatePatient.bind(this);
    this.updateInsurance = this.updateInsurance.bind(this);
    this.showPhoneConsent = this.showPhoneConsent.bind(this);
    this.hidePhoneConsent = this.hidePhoneConsent.bind(this);
    this.state = {
      displayConsentToPhoneTextPopup: false,
      loading: false,
      patient: {
        homeClinicId: '',
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        race: '',
        ssn: '',
        zip: '',
        language6392code: '',
        email: '',
        homePhone: '',
        mobilePhone: '',
        ethnicityCode: '',
        consentToText: 'false',
        consentToCall: 'false',
        preferredContactMethod: 'Cell',
      },
      insurance: {
        insuranceType: '',
        patientRelationshipToPolicyHolder: '',
        memberId: '',
        policyGroupNumber: '',
        issueDate: '',
        expirationDate: '',
      },
    };
  }

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.clinic) {
      const patient = this.state.patient;
      patient.homeClinicId = newProps.clinic.id;
      this.setState({ patient });
    }
  }

  onUploadPhotoClick() {
    alert('TODO');
  }

  onTakePhotoClick() {
    alert('TODO');
  }

  updatePatient(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const property = event.target.name;
    const patient = this.state.patient;
    (patient as any)[property] = event.target.value;
    this.setState({ patient });
  }

  updateInsurance(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const property = event.target.name;
    const insurance = this.state.insurance;
    (insurance as any)[property] = event.target.value;
    this.setState({ insurance });
  }

  showPhoneConsent() {
    this.setState({ displayConsentToPhoneTextPopup: true });
  }

  hidePhoneConsent() {
    this.setState({ displayConsentToPhoneTextPopup: false });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const patient = await this.props.createPatient({
        variables: {
          ...this.state.patient,
          ...this.state.insurance,
          consentToCall: this.state.patient.consentToCall === 'true' ? true : false,
          consentToText: this.state.patient.consentToText === 'true' ? true : false,
          race: this.state.patient.race,
          zip: Number(this.state.patient.zip),
          issueDate: formatDate(this.state.insurance.issueDate),
          expirationDate: formatDate(this.state.insurance.expirationDate),
          dateOfBirth: formatDate(this.state.patient.dateOfBirth),
        },
      });
      this.setState({ createdPatient: patient.data.patientSetup, loading: false });
    } catch (e) {
      this.setState({ error: e, loading: false });
      alert(JSON.stringify(e));
    }
    return false;
  }

  render() {
    const { insurance, patient } = this.state;
    const languagesHtml = langs.all().map((language: langs.Language) => (
      <option key={language['2']} value={language['2']}>{language.name}</option>
    ));
    const ethnicitiesHtml = Object.keys(ethnicities).map(key => (
      <option key={key} value={key}>{ethnicities[key]}</option>
    ));
    const racesHtml = races.map((race: any) => (
      <option key={race.code} value={race.code}>{race.display}</option>
    ));
    const relationshipToPatientHtml = Object.keys(
      relationshipToPatientOptions,
    ).map((key: string) => (
      <option key={key} value={key}>{relationshipToPatientOptions[key]}</option>
    ));
    const insuranceTypeOptionsHtml = Object.keys(insuranceTypeOptions).map((key: string) => (
      <option key={key} value={key}>{insuranceTypeOptions[key]}</option>
    ));
    const loadingClass = this.state.loading ? styles.loading : styles.loadingHidden;
    return (
      <form onSubmit={this.onSubmit} className={styles.container}>
        <PopupConsent
          onClose={this.hidePhoneConsent}
          visible={this.state.displayConsentToPhoneTextPopup} />
        <PopupPatientCreated patient={this.state.createdPatient} />
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner}></div>
          </div>
        </div>
        <div className={styles.formContainer}>
          <div className={styles.leftNav}>
            <div className={styles.leftNavLink}>Demographic info</div>
            <div className={styles.leftNavLink}>Contact info</div>
            <div className={styles.leftNavLink}>Insurance info</div>
            <div className={styles.leftNavLink}>Upload photo</div>
          </div>
          <div className={styles.form}>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Tell us about this patient</div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>First name</div>
                  <input required
                    name='firstName'
                    value={patient.firstName}
                    className={styles.input}
                    onChange={this.updatePatient} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>
                    Middle name
                    <span className={styles.optionalLabel}>optional</span>
                  </div>
                  <input
                    name='middleName'
                    value={patient.middleName}
                    className={styles.input}
                    onChange={this.updatePatient} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Last name</div>
                  <input required
                    name='lastName'
                    value={patient.lastName}
                    className={styles.input}
                    onChange={this.updatePatient} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Date of birth</div>
                  <input required
                    name='dateOfBirth'
                    className={styles.input}
                    value={patient.dateOfBirth}
                    type='date'
                    onChange={this.updatePatient} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>
                    Gender
                  </div>
                  <select required
                    name='gender'
                    value={patient.gender}
                    onChange={this.updatePatient}
                    className={styles.select}>
                    <option value='' disabled hidden>Select gender</option>
                    <option value='M'>Male</option>
                    <option value='F'>Female</option>
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Marital status</div>
                  <select required
                    name='maritalStatus'
                    value={patient.maritalStatus}
                    onChange={this.updatePatient}
                    className={styles.select}>
                    <option value='' disabled hidden>Select status</option>
                    <option value='U'>Unknown</option>
                    <option value='D'>Divorced</option>
                    <option value='M'>Married</option>
                    <option value='S'>Single</option>
                    <option value='W'>Widowed</option>
                    <option value='S'>Separated</option>
                    <option value='P'>Partner</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Preferred language</div>
                  <select required
                    name='language6392code'
                    value={patient.language6392code}
                    onChange={this.updatePatient}
                    className={styles.select}>
                    <option value='' disabled hidden>Select language</option>
                    <option value='declined'>Declined</option>
                    {languagesHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Race</div>
                  <select required
                    name='race'
                    value={patient.race}
                    onChange={this.updatePatient}
                    className={styles.select}>
                    <option value='' disabled hidden>Select race</option>
                    <option value='declined'>Declined</option>
                    {racesHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Ethnicity</div>
                  <select required
                    name='ethnicityCode'
                    value={patient.ethnicityCode}
                    onChange={this.updatePatient}
                    className={styles.select}>
                    <option value='' disabled hidden>Select ethnicity</option>
                    <option value='declined'>Declined</option>
                    {ethnicitiesHtml}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Social Security Number</div>
                  <input required
                    name='ssn'
                    type='number'
                    value={patient.ssn}
                    onChange={this.updatePatient}
                    className={styles.input} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Zip code</div>
                  <input required
                    type='number'
                    name='zip'
                    value={patient.zip}
                    onChange={this.updatePatient}
                    className={styles.input} />
                </div>
              </div>
            </div>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Patient contact information</div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>
                    Email Address
                    <span className={styles.optionalLabel}>optional</span>
                  </div>
                  <input
                    name='email'
                    value={patient.email}
                    onChange={this.updatePatient}
                    className={styles.input} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Home Phone Number</div>
                  <input
                    name='homePhone'
                    type='tel'
                    value={patient.homePhone}
                    className={styles.input}
                    onChange={this.updatePatient} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Mobile Phone Number</div>
                  <input
                    name='mobilePhone'
                    type='tel'
                    value={patient.mobilePhone}
                    onChange={this.updatePatient}
                    className={styles.input} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.radioRow}>
                  <div className={styles.radioRowLeft}>
                    <div className={styles.label}>
                      Does the patient consent to being contacted via text?
                    </div>
                    <div className={styles.smallText}>
                      <span>Read consent statement to patient: </span>
                      <a onClick={this.showPhoneConsent}>click here</a>
                    </div>
                  </div>
                  <div className={styles.radioRowRight}>
                    <div className={styles.radioItem}>
                      <div className={styles.radioContainer}>
                        <input
                          className={styles.radio}
                          type='radio'
                          name='consentToText'
                          onChange={this.updatePatient}
                          value='true' />
                        <label />
                      </div>
                      <span className={styles.radioLabel}>Yes</span>
                    </div>
                    <div className={styles.radioItem}>
                      <div className={styles.radioContainer}>
                        <input
                          className={styles.radio}
                          type='radio'
                          name='consentToText'
                          onChange={this.updatePatient}
                          value='false' />
                        <label />
                      </div>
                      <span className={styles.radioLabel}>No</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.radioRow}>
                  <div className={styles.radioRowLeft}>
                    <div className={styles.label}>
                      Does the patient consent to being contacted via phone?
                    </div>
                    <div className={styles.smallText}>
                      <span>Read consent statement to patient: </span>
                      <a onClick={this.showPhoneConsent}>click here</a>
                    </div>
                  </div>
                  <div className={styles.radioRowRight}>
                    <div className={styles.radioItem}>
                      <div className={styles.radioContainer}>
                        <input
                          className={styles.radio}
                          type='radio'
                          name='consentToCall'
                          onChange={this.updatePatient}
                          value='true' />
                        <label />
                      </div>
                      <span className={styles.radioLabel}>Yes</span>
                    </div>
                    <div className={styles.radioItem}>
                      <div className={styles.radioContainer}>
                        <input
                          className={styles.radio}
                          type='radio'
                          name='consentToCall'
                          onChange={this.updatePatient}
                          value='false' />
                        <label />
                      </div>
                      <span className={styles.radioLabel}>No</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Patient insurance information</div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Insurance Type</div>
                  <select required
                    name='insuranceType'
                    value={insurance.insuranceType}
                    onChange={this.updateInsurance}
                    className={styles.select}>
                    <option value='' disabled hidden>Select insurance type</option>
                    {insuranceTypeOptionsHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Patient relationship to policy holder</div>
                  <select required
                    name='patientRelationshipToPolicyHolder'
                    value={insurance.patientRelationshipToPolicyHolder}
                    onChange={this.updateInsurance}
                    className={styles.select}>
                    <option value='' disabled hidden>Select relationship</option>
                    {relationshipToPatientHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Member ID</div>
                  <input
                    name='memberId'
                    value={insurance.memberId}
                    onChange={this.updateInsurance}
                    className={styles.input} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Policy group number</div>
                  <input
                    type='number'
                    name='policyGroupNumber'
                    value={insurance.policyGroupNumber}
                    onChange={this.updateInsurance}
                    className={styles.input} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Issue date</div>
                  <input
                    name='issueDate'
                    value={this.state.insurance.issueDate}
                    onChange={this.updateInsurance}
                    type='date'
                    className={styles.input} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Expiration date</div>
                  <input
                    name='expirationDate'
                    value={this.state.insurance.expirationDate}
                    onChange={this.updateInsurance}
                    type='date'
                    className={styles.input} />
                </div>
              </div>
            </div>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Patient photo</div>
              <div className={styles.formRow}>
                <PatientPhotoUpload
                  onUploadPhotoClick={this.onUploadPhotoClick}
                  onTakePhotoClick={this.onTakePhotoClick} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Link to={'/patients'} className={styles.cancelButton}>Cancel</Link>
            <input
              type='submit'
              className={styles.submitButton}
              value='Submit' />
          </div>
        </div>
      </form >
    );
  }
}

const setupPatientMutation = getQuery('app/graphql/queries/patient-setup-mutation.graphql');
const getClinicsQuery = getQuery('app/graphql/queries/clinics-get.graphql');

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    onSuccess: (patientId: string) => {
      dispatch(push(`/patient/${patientId}`));
    },
  };
}

function formatClinic(clinics: any) {
  if (clinics) {
    return clinics.edges[0].node;
  }
}

export default (compose as any)(
  connect(undefined, mapDispatchToProps),
  graphql(setupPatientMutation, { name: 'createPatient' }),
  graphql(getClinicsQuery, {
    options: {
      variables: {
        pageNumber: 0,
        pageSize: 10,
      },
    },
    props: ({ data }) => ({
      clinicsLoading: (data ? data.loading : false),
      clinicsError: (data ? data.error : null),
      clinic: (data ? formatClinic((data as any).clinics) : null),
    }),
  }),
)(PatientEnrolementContainer);
