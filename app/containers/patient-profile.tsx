import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { IState as IAppState } from '../client';
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
          <div className={styles.encountersPanel}>
            <div className={styles.newEncounter}>
              <div className={styles.newEncounterButton}>Record new encounter</div>
            </div>
            <div className={styles.encounters}>
              <div className={styles.encounter}>
                <div className={styles.encounterTitle}>
                  <div className={styles.providerInfo}>
                    <div className={styles.providerName}>Linda Sandoval</div>
                    <div className={styles.providerRole}>Nurse practicioner</div>
                  </div>
                  <div className={styles.encounterDateTime}>
                    <div className={styles.encounterTime}>11:20am</div>
                    <div className={styles.encounterDate}>May 21, 2017</div>
                  </div>
                </div>
                <div className={styles.encounterBody}>
                  <div className={styles.encounterHeader}>
                    <div className={styles.encounterSummary}>
                      Weekly visit with Thomas
                    </div>
                    <div className={styles.encounterHamburger}></div>
                  </div>
                  <div className={styles.encounterMain}>
                    {'Thomas was in good spirits. He has stressed that he was compliant with his ' +
                    'diabetes medications and has been eating well. I encouraged Thomas to get ' +
                    'his daily exercise Nulla vitae elit libero, a pharetra augue.'}
                  </div>
                  <div className={styles.encounterFooter}>
                    <div className={styles.encounterLocation}>Patient's home</div>
                  </div>
                </div>
              </div>
              <div className={styles.encounter}>
                <div className={styles.encounterTitle}>
                  <div className={styles.providerInfo}>
                    <div className={styles.providerName}>Dr. Jeffery Rice</div>
                    <div className={styles.providerRole}>Primary care physician</div>
                  </div>
                  <div className={styles.encounterDateTime}>
                    <div className={styles.encounterTime}>12:12pm</div>
                    <div className={styles.encounterDate}>May 14, 2017</div>
                  </div>
                </div>
                <div className={styles.encounterBody}>
                  <div className={styles.encounterHeader}>
                    <div className={styles.encounterSummary}>
                      Diabetes monitoring - First check-in
                    </div>
                    <div className={styles.encounterHamburger}></div>
                  </div>
                  <div className={styles.encounterMain}>
                    {'Thomas presented this morning with no new symptoms. Patient states that he ' +
                    'has been taking his medications as prescribed but his blood glucose was 258 ' +
                    'today. Thomas did mention that he has not been able to eat well this past ' +
                    'week and has resorted to a lot of fast-food meals. He denies drinking ' +
                    'excessively. Will write for a refill Rx of his Metformin.'}
                  </div>
                  <div className={styles.encounterFooter}>
                    <div className={styles.encounterLocation}>Bellvue Medical Practice</div>
                    <div className={styles.encounterAttachments}>
                      <div className={styles.encounterAttachmentPhoto}>
                        <img src={
                          'https://lh4.googleusercontent.com/-fgvDmb1D_Aw/AAAAAAAAAAI/' +
                          'AAAAAAAAAAs/MOKfIO7GrdY/s96-c/photo.jpg'}
                        />
                      </div>
                      <div className={styles.encounterAttachmentPhoto}>
                        <img src={
                          'https://lh4.googleusercontent.com/-fgvDmb1D_Aw/AAAAAAAAAAI/' +
                          'AAAAAAAAAAs/MOKfIO7GrdY/s96-c/photo.jpg'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.encounter}>
                <div className={styles.encounterTitle}>
                  <div className={styles.providerInfo}>
                    <div className={styles.providerName}>George Perkins</div>
                    <div className={styles.providerRole}>Community care worker</div>
                  </div>
                  <div className={styles.encounterDateTime}>
                    <div className={styles.encounterTime}>9:00am</div>
                    <div className={styles.encounterDate}>May 21, 2017</div>
                  </div>
                </div>
                <div className={styles.encounterBody}>
                  <div className={styles.encounterHeader}>
                    <div className={styles.encounterSummary}>
                      Welcome visit - onboarding
                    </div>
                    <div className={styles.encounterHamburger}></div>
                  </div>
                  <div className={styles.encounterMain}>
                    {'Today was my Welcome intro session with Thomas. Maecenas sed diam eget ' +
                    'risus varius blandit sit amet non magna. Fusce dapibus, tellus ac cursus ' +
                    'commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit ' +
                    'amet risus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor ' +
                    'auctor. Donec id elit non mi porta gravida at eget metus. Sed posuere ' +
                    'consectetur est at lobortis.'}
                  </div>
                  <div className={styles.encounterFooter}>
                    <div className={styles.encounterLocation}>Patient's home</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
