import * as langs from 'langs';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as styles from '../css/components/patient-enrollment.css';
import { getQuery } from '../graphql/helpers';
import {
  PatientHealthRecordEditMutationVariables,
  PatientSetupMutationVariables,
} from '../graphql/types';
import ethnicities from '../util/ethnicity-codes';
import races from '../util/race-codes';

export interface IProps {
  editPatientHealthRecord: (
    options: { variables: PatientHealthRecordEditMutationVariables },
  ) => any;
  createPatient: (options: { variables: PatientSetupMutationVariables }) => any;
  onSuccess: (patientId: string) => any;
}

export interface IState {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  race: string;
  ethnicity: string;
  hasSocialSecurityNumber: boolean;
  socialSecurityNumber: string;
  emailAddress: string;
  phoneNumber: string;
  phoneNumberType: string;
  consentToText: boolean;
  consentToPhone: boolean;
  preferredContactMethod: string;
  // TODO: insurance
  insuranceType: string;
  patientRelationshipToPolicyHolder: string;
  memberId: string;
  policyGroupNumber: string;
  issueDate: string;
  expirationDate: string;
}

class PatientEnrolementContainer extends React.Component<IProps, Partial<IState>> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  updateFirstName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ firstName: event.target.value });
  }

  updateMiddletName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ middleName: event.target.value });
  }

  updateLastName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ lastName: event.target.value });
  }
  updateDateOfBirth(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ dateOfBirth: event.target.value });
  }

  render() {
    const languagesHtml = langs.all().map((language: langs.Language) => (
      <option key={language['2']} value={language['2']}>{language.name}</option>
    ));
    const ethnicitiesHtml = Object.keys(ethnicities).map(key => (
      <option key={key} value={key}>{ethnicities[key]}</option>
    ));
    const racesHtml = races.map((race: any)  => (
      <option key={race.code} value={race.code}>{race.display}</option>
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
                  <input className={styles.input} onChange={this.updateFirstName.bind(this)} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>
                    Middle name
                    <span className={styles.optionalLabel}>optional</span>
                  </div>
                  <input className={styles.input} onChange={this.updateFirstName.bind(this)} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Middle name</div>
                  <input className={styles.input} onChange={this.updateFirstName.bind(this)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Date of birth</div>
                  <input
                    className={styles.input}
                    type='date'
                    onChange={this.updateDateOfBirth.bind(this)} />
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>
                    Gender
                  </div>
                  <select className={styles.select}>
                    <option value='M'>Male</option>
                    <option value='F'>Female</option>
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Marital status</div>
                  <select className={styles.select}>
                    <option value='D'>Divorced</option>
                    <option value='M'>Married</option>
                    <option value='S'>Single</option>
                    <option value='U'>Unknown</option>
                    <option value='W'>Widowed</option>
                    <option value='S'>Separated</option>
                    <option value='P'>Partner</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Preferred language</div>
                  <select className={styles.select}>
                    {languagesHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Race</div>
                  <select className={styles.select}>
                    {racesHtml}
                  </select>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.label}>Ethnicity</div>
                  <select className={styles.select}>
                    {ethnicitiesHtml}
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Patient contact information</div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>First name</div>
                  <input className={styles.input} />
                </div>
              </div>
            </div>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Patient insurance information</div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>First name</div>
                  <input className={styles.input} />
                </div>
              </div>
            </div>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Patient photo</div>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.label}>First name</div>
                  <input className={styles.input} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <button className={styles.cancelButton}>Cancel</button>
            <button className={styles.submitButton}>Save</button>
          </div>
        </div>
      </div>
    );
  }
}

const setupPatientMutation = getQuery('app/graphql/queries/patient-setup-mutation.graphql');
const editPatientHealthRecordMutation = getQuery(
  'app/graphql/queries/patient-health-record-edit-mutation.graphql',
);

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    onSuccess: (patientId: string) => {
      dispatch(push(`/patient/${patientId}`));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql(setupPatientMutation, { name: 'createPatient' }),
  graphql(editPatientHealthRecordMutation, { name: 'editPatientHealthRecord' }),
)(PatientEnrolementContainer);
