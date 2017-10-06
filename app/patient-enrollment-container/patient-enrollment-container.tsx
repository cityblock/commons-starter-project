import { format } from 'date-fns';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as getClinicsQuery from '../graphql/queries/clinics-get.graphql';
import * as setupPatientMutation from '../graphql/queries/patient-setup-mutation.graphql';
import {
  patientSetupMutationVariables,
  FullClinicFragment,
  ShortPatientFragment,
} from '../graphql/types';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import PatientContactForm from '../shared/patient-contact-form';
import PatientDemographicsForm from '../shared/patient-demographics-form';
import PatientInsuranceForm from '../shared/patient-insurance-form';
import { PatientPhotoUpload } from '../shared/patient-photo-upload';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/patient-enrollment.css';
import PopupEnrollmentError from './popup-enrollment-error';
import PopupPatientCreated from './popup-patient-created';

interface IProps {
  createPatient: (
    options: { variables: patientSetupMutationVariables },
  ) => { data: { patientSetup: ShortPatientFragment } };
  onSuccess: (patientId: string) => any;
  clinic: FullClinicFragment;
  clinicsLoading: boolean;
  clinicsError?: string;
}

interface IState {
  displayErrorPopup: boolean;
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
    language: string;
    email: string;
    homePhone: string;
    mobilePhone: string;
    consentToText: string;
    consentToCall: string;
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
  return format(new Date(date.replace('-', '/')), 'MM/DD/YYYY');
}

class PatientEnrollmentContainer extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onInsuranceFieldUpdate = this.onInsuranceFieldUpdate.bind(this);
    this.showErrorPopup = this.showErrorPopup.bind(this);
    this.hideErrorPopup = this.hideErrorPopup.bind(this);
    this.state = {
      displayErrorPopup: false,
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
        language: '',
        email: '',
        homePhone: '',
        mobilePhone: '',
        consentToText: 'false',
        consentToCall: 'false',
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

  componentDidMount() {
    document.title = 'Add Patient | Commons';
  }

  onUploadPhotoClick() {
    alert('TODO');
  }

  onTakePhotoClick() {
    alert('TODO');
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { patient } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (patient as any)[fieldName] = fieldValue;

    this.setState(() => ({ patient }));
  }

  onInsuranceFieldUpdate(updatedField: IUpdatedField) {
    const { insurance } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (insurance as any)[fieldName] = fieldValue;

    this.setState(() => ({ insurance }));
  }

  showErrorPopup() {
    this.setState({ displayErrorPopup: true });
  }

  hideErrorPopup() {
    this.setState({ displayErrorPopup: false });
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
          zip: this.state.patient.zip,
          issueDate: formatDate(this.state.insurance.issueDate),
          expirationDate: formatDate(this.state.insurance.expirationDate),
          dateOfBirth: formatDate(this.state.patient.dateOfBirth),
        },
      });
      this.setState({ createdPatient: patient.data.patientSetup, loading: false });
    } catch (e) {
      this.setState({ error: e.message, loading: false });
      this.showErrorPopup();
    }
    return false;
  }

  render() {
    const {
      insurance,
      patient,
      loading,
      createdPatient,
      displayErrorPopup,
      error,
    } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    return (
      <form onSubmit={this.onSubmit} className={styles.container}>
        <PopupPatientCreated patient={createdPatient} />
        <PopupEnrollmentError
          onClose={this.hideErrorPopup}
          visible={displayErrorPopup}
          error={error} />
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
              <PatientDemographicsForm
                fields={{
                  firstName: patient.firstName,
                  middleName: patient.middleName,
                  lastName: patient.lastName,
                  dateOfBirth: patient.dateOfBirth,
                  gender: patient.gender,
                  maritalStatus: patient.maritalStatus,
                  language: patient.language,
                  race: patient.race,
                  ssn: patient.ssn,
                  zip: patient.zip,
                }}
                onFieldUpdate={this.onFieldUpdate}
              />
            </div>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Patient contact information</div>
              <PatientContactForm
                fields={{
                  email: patient.email,
                  homePhone: patient.homePhone,
                  mobilePhone: patient.mobilePhone,
                  consentToCall: patient.consentToCall,
                  consentToText: patient.consentToText,
                }}
                onFieldUpdate={this.onFieldUpdate}
              />
            </div>
            <div className={styles.formSection}>
              <div className={styles.formHeading}>Patient insurance information</div>
              <PatientInsuranceForm
                fields={{
                  insuranceType: insurance.insuranceType,
                  patientRelationshipToPolicyHolder: insurance.patientRelationshipToPolicyHolder,
                  memberId: insurance.memberId,
                  policyGroupNumber: insurance.policyGroupNumber,
                  issueDate: insurance.issueDate,
                  expirationDate: insurance.expirationDate,
                }}
                onFieldUpdate={this.onInsuranceFieldUpdate}
              />
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
              value='submit' />
          </div>
        </div>
      </form >
    );
  }
}

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
  graphql(setupPatientMutation as any, { name: 'createPatient' }),
  graphql(getClinicsQuery as any, {
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
)(PatientEnrollmentContainer);
