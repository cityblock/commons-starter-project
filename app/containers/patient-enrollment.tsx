import * as langs from 'langs';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { PatientPhotoUpload } from '../components/patient-photo-upload';
import * as styles from '../css/components/patient-enrollment.css';
import { getQuery } from '../graphql/helpers';
import { FullClinicFragment, PatientSetupMutationVariables } from '../graphql/types';
import ethnicities from '../util/ethnicity-codes';
import insuranceTypeOptions from '../util/insurance-type-options';
import races from '../util/race-codes';
import relationshipToPatientOptions from '../util/relationship-to-patient-options';

export interface IProps {
  createPatient: (options: { variables: PatientSetupMutationVariables }) => any;
  onSuccess: (patientId: string) => any;
  clinic: FullClinicFragment;
  clinicsLoading: boolean;
  clinicsError?: string;
}

export interface IState {
  homeClinicId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  race: string[];
  zip: number;
  ssn: string;
  language6392code: string;
  email: string;
  homePhone: string;
  mobilePhone: string;
  ethnicityCode: string;
  consentToText: boolean;
  consentToCall: boolean;
  preferredContactMethod: string;
  insuranceType: string;
  patientRelationshipToPolicyHolder: string;
  memberId: string;
  policyGroupNumber: string;
  issueDate: string;
  expirationDate: string;
}

function formatDate(date: string) {
  return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
}

class PatientEnrolementContainer extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateMiddleName = this.updateMiddleName.bind(this);
    this.updateDateOfBirth = this.updateDateOfBirth.bind(this);
    this.updateGender = this.updateGender.bind(this);
    this.updateLanguage = this.updateLanguage.bind(this);
    this.updateMaritalStatus = this.updateMaritalStatus.bind(this);
    this.updateEthnicity = this.updateEthnicity.bind(this);
    this.updateSSN = this.updateSSN.bind(this);
    this.updateZip = this.updateZip.bind(this);
    this.updateRace = this.updateRace.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateHomePhoneNumber = this.updateHomePhoneNumber.bind(this);
    this.updateMobilePhoneNumber = this.updateMobilePhoneNumber.bind(this);
    this.updateInsuranceType = this.updateInsuranceType.bind(this);
    this.updatePatientRelationship = this.updatePatientRelationship.bind(this);
    this.updateMemberId = this.updateMemberId.bind(this);
    this.updatePolicyGroupNumber = this.updatePolicyGroupNumber.bind(this);
    this.updateIssueDate = this.updateIssueDate.bind(this);
    this.updateExpirationDate = this.updateExpirationDate.bind(this);
    this.state = {
      homeClinicId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      race: [],
      ssn: '',
      zip: 11238,
      language6392code: '',
      email: '',
      homePhone: '',
      mobilePhone: '',
      ethnicityCode: '',
      consentToText: false,
      consentToCall: false,
      preferredContactMethod: 'Cell',
      insuranceType: '',
      patientRelationshipToPolicyHolder: '',
      memberId: '',
      policyGroupNumber: '',
      issueDate: '',
      expirationDate: '',
    };
  }

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.clinic) {
      this.setState({ homeClinicId: newProps.clinic.id });
    }
  }

  onUploadPhotoClick() {
    alert('TODO');
  }

  onTakePhotoClick() {
    alert('TODO');
  }

  updateFirstName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ firstName: event.target.value });
  }

  updateMiddleName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ middleName: event.target.value });
  }

  updateLastName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ lastName: event.target.value });
  }

  updateDateOfBirth(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ dateOfBirth: event.target.value });
  }

  updateGender(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ gender: event.target.value });
  }

  updateMaritalStatus(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ maritalStatus: event.target.value });
  }

  updateLanguage(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ language6392code: event.target.value });
  }

  updateEthnicity(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ ethnicityCode: event.target.value });
  }

  updateRace(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ race: [event.target.value] });
  }

  updateSSN(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ ssn: event.target.value });
  }

  updateZip(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ zip: Number(event.target.value) });
  }

  updateEmail(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.target.value });
  }

  updateHomePhoneNumber(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ homePhone: event.target.value });
  }

  updateMobilePhoneNumber(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ mobilePhone: event.target.value });
  }

  updateInsuranceType(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ insuranceType: event.target.value });
  }

  updatePatientRelationship(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ patientRelationshipToPolicyHolder: event.target.value });
  }

  updateMemberId(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ memberId: event.target.value });
  }

  updatePolicyGroupNumber(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ policyGroupNumber: event.target.value });
  }

  updateIssueDate(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ issueDate: event.target.value });
  }

  updateExpirationDate(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ expirationDate: event.target.value });
  }

  async onSaveClick() {
    await this.props.createPatient({
      variables: {
        ...this.state,
        issueDate: formatDate(this.state.issueDate),
        expirationDate: formatDate(this.state.expirationDate),
        dateOfBirth: formatDate(this.state.dateOfBirth),
      },
    });
  }

  render() {
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

    return (
      <div className={styles.container}>
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
                    value={this.state.firstName}
                    className={styles.input}
                    onChange={this.updateFirstName} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>
                    Middle name
                    <span className={styles.optionalLabel}>optional</span>
                  </div>
                  <input
                    value={this.state.middleName}
                    className={styles.input}
                    onChange={this.updateMiddleName} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Last name</div>
                  <input required
                    value={this.state.lastName}
                    className={styles.input}
                    onChange={this.updateLastName} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Date of birth</div>
                  <input
                    required
                    className={styles.input}
                    value={this.state.dateOfBirth}
                    type='date'
                    onChange={this.updateDateOfBirth} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>
                    Gender
                  </div>
                  <select required
                    value={this.state.gender}
                    onChange={this.updateGender}
                    className={styles.select}>
                    <option value='' disabled hidden>Select gender</option>
                    <option value='M'>Male</option>
                    <option value='F'>Female</option>
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Marital status</div>
                  <select required
                    value={this.state.maritalStatus}
                    onChange={this.updateMaritalStatus}
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
                    value={this.state.language6392code}
                    onChange={this.updateLanguage}
                    className={styles.select}>
                    <option value='' disabled hidden>Select language</option>
                    <option value='declined'>Declined</option>
                    {languagesHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Race</div>
                  <select required
                    value={this.state.race[0]}
                    onChange={this.updateRace}
                    className={styles.select}>
                    <option value='' disabled hidden>Select race</option>
                    <option value='declined'>Declined</option>
                    {racesHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Ethnicity</div>
                  <select required
                    value={this.state.ethnicityCode}
                    onChange={this.updateEthnicity}
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
                    value={this.state.ssn}
                    onChange={this.updateSSN}
                    className={styles.input} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Zip code</div>
                  <input required
                    type='number'
                    value={this.state.zip}
                    onChange={this.updateZip}
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
                    value={this.state.email}
                    onChange={this.updateEmail}
                    className={styles.input} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Home Phone Number</div>
                  <input
                    value={this.state.homePhone}
                    className={styles.input}
                    onChange={this.updateHomePhoneNumber} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Mobile Phone Number</div>
                  <input
                    value={this.state.mobilePhone}
                    onChange={this.updateMobilePhoneNumber}
                    className={styles.input} />
                </div>
              </div>
            </div>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Patient insurance information</div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Insurance Type</div>
                  <select required
                    value={this.state.insuranceType}
                    onChange={this.updateInsuranceType}
                    className={styles.select}>
                    <option value='' disabled hidden>Select insurance type</option>
                    {insuranceTypeOptionsHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Patient relationship to policy holder</div>
                  <select required
                    value={this.state.patientRelationshipToPolicyHolder}
                    onChange={this.updatePatientRelationship}
                    className={styles.select}>
                    <option value='' disabled hidden>Select relationship</option>
                    {relationshipToPatientHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Member ID</div>
                  <input
                    value={this.state.memberId}
                    onChange={this.updateMemberId}
                    className={styles.input} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Policy group number</div>
                  <input
                    type='number'
                    value={this.state.policyGroupNumber}
                    onChange={this.updatePolicyGroupNumber}
                    className={styles.input} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Issue date</div>
                  <input
                    value={this.state.issueDate}
                    onChange={this.updateIssueDate}
                    type='date'
                    className={styles.input} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Expiration date</div>
                  <input
                    value={this.state.expirationDate}
                    onChange={this.updateExpirationDate}
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
            <button onClick={this.onSaveClick} className={styles.submitButton}>Save</button>
          </div>
        </div>
      </div>
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
