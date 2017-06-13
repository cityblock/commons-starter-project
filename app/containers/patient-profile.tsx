import * as classNames from 'classnames';
import * as langs from 'langs';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { IState as IAppState } from '../client';
import CareTeamWidget from '../components/care-team-widget';
import PatientEncounters from '../components/patient-encounters';
import PatientMedications from '../components/patient-medications';
import PatientScratchPad from '../components/patient-scratch-pad';
import { DATETIME_FORMAT } from '../config';
import * as styles from '../css/components/patient-profile-scene.css';
import { getQuery } from '../graphql/helpers';
import { ShortPatientFragment } from '../graphql/types';

export interface IProps {
  patientId: string;
  loading: boolean;
  error?: string;
  patient?: ShortPatientFragment;
  match: {
    params: {
      patientId: string;
    };
  };
}

const GENDER: any = { F: 'Female', M: 'Male' };

class PatientProfileContainer extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { patientId, patient } = this.props;
    const name = patient ?
      [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ') :
      null;
    const patientAge = patient && patient.dateOfBirth ?
      moment(patient.dateOfBirth, DATETIME_FORMAT).fromNow(true) :
      'Unknown';
    const dateOfBirth = patient && patient.dateOfBirth ?
      moment(patient.dateOfBirth, DATETIME_FORMAT).format('LL') :
      'Unknown';
    const patientJoined = patient && patient.createdAt ?
      `${moment(patient.createdAt, DATETIME_FORMAT).fromNow(true)} ago` :
      'Unknown';
    const gender = patient && patient.gender ? GENDER[patient.gender] : null;
    const zip = patient && patient.zip ? patient.zip : null;
    const language = patient && patient.language ? langs.where('1', patient.language).name : null;
    return (
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <div className={styles.patientRisk}>Medium Risk Patient</div>
          <div className={styles.patientMain}>
            <div className={styles.patientHeader}>
              <div className={styles.patientPhoto}>
                <img src={
                  'https://lh4.googleusercontent.com/-fgvDmb1D_Aw/AAAAAAAAAAI/AAAAAAAAAAs' +
                  '/MOKfIO7GrdY/s96-c/photo.jpg'}
                />
              </div>
              <div className={styles.patientTitle}>
                <div className={styles.patientName}>{name}</div>
                <div className={styles.patientSubheading}>{patientAge} years old • {gender}</div>
              </div>
            </div>
            <div className={styles.patientBasicInfo}>
              <div className={styles.patientBasicInfoRow}>
                <div className={styles.patientBasicInfoRowTitle}>Date of birth:</div>
                <div className={styles.patientBasicInfoRowData}>{dateOfBirth}</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <div className={styles.patientBasicInfoRowTitle}>Preferred language:</div>
                <div className={styles.patientBasicInfoRowData}>{language}</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <div className={styles.patientBasicInfoRowTitle}>Location:</div>
                <div className={styles.patientBasicInfoRowData}>{zip}</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <div className={styles.patientBasicInfoRowTitle}>Patient since:</div>
                <div className={styles.patientBasicInfoRowData}>{patientJoined}</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <div className={styles.patientBasicInfoRowTitle}>Medicare ID:</div>
                <div className={styles.patientBasicInfoRowData}>123456789</div>
              </div>
            </div>
            <div className={styles.patientCommunication}>
              <div className={classNames(styles.patientCommItem, styles.patientCommPhone)}></div>
              <div className={classNames(styles.patientCommItem, styles.patientCommText)}></div>
              <div className={classNames(styles.patientCommItem, styles.patientCommEmail)}></div>
              <div className={classNames(styles.patientCommItem, styles.patientCommVideo)}></div>
            </div>
            <PatientScratchPad patientId={patientId} />
          </div>
          <PatientMedications patientId={patientId} />
        </div>
        <div className={styles.mainBody}>
          <div className={styles.tabs}>
            <div className={classNames(styles.tab, styles.selectedTab)}>Encounters</div>
            <div className={styles.tab}>Patient info</div>
          </div>
          <div className={styles.sortSearchBar}>
            <div className={styles.sort}>
              <div className={styles.sortLabel}>Sort by:</div>
              <div className={styles.sortDropdown}>
                <select value='Newest first'>
                  <option value='Newest first'>Newest first</option>
                </select>
              </div>
            </div>
            <div className={styles.search}>
              <input required type='text' placeholder='Search by user or keywords' />
            </div>
          </div>
          <PatientEncounters patientId={patientId} />
        </div>
        <CareTeamWidget patientId={patientId} />
      </div>
    );
  }
}

const patientQuery = getQuery('app/graphql/queries/get-patient.graphql');

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    patientId: ownProps.match.params.patientId,
  };
}

export default compose(
  connect(mapStateToProps),
  graphql(patientQuery, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      patient: (data ? (data as any).patient : null),
    }),
  }),
)(PatientProfileContainer);
