import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { IState as IAppState } from '../client';
import CareTeamWidget from '../components/care-team-widget';
import PatientEncounters from '../components/patient-encounters';
import PatientMedications from '../components/patient-medications';
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

class PatientProfileContainer extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  render() {
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
                <div className={styles.patientName}>Thomas L. Jordan</div>
                <div className={styles.patientSubheading}>67 years old • Male</div>
              </div>
            </div>
            <div className={styles.patientBasicInfo}>
              <div className={styles.patientBasicInfoRow}>
                <div className={styles.patientBasicInfoRowTitle}>Date of birth:</div>
                <div className={styles.patientBasicInfoRowData}>Oct 12, 1947</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <div className={styles.patientBasicInfoRowTitle}>Preferred language:</div>
                <div className={styles.patientBasicInfoRowData}>English</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <div className={styles.patientBasicInfoRowTitle}>Location:</div>
                <div className={styles.patientBasicInfoRowData}>Brooklyn, NY</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <div className={styles.patientBasicInfoRowTitle}>Patient since:</div>
                <div className={styles.patientBasicInfoRowData}>4 days ago</div>
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
            <div className={styles.patientScratchPad}>
              <textarea className={styles.textArea}>
                {"Please be aware that there's a dog in Thomas' apartment that has a history of " +
                "biting. Please be mindful when arriving at his home. The dog's name is Rex."}
              </textarea>
            </div>
          </div>
          <PatientMedications patientId={this.props.patientId} />
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
          <PatientEncounters patientId={this.props.patientId} />
        </div>
        <CareTeamWidget patientId={this.props.patientId} />
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
