import * as classNames from 'classnames';
import * as langs from 'langs';
import * as moment from 'moment';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import CareTeamWidget from '../components/care-team-widget';
import PatientEncounters from '../components/patient-encounters';
import PatientInfo from '../components/patient-info';
import PatientMedications from '../components/patient-medications';
import PatientScratchPad from '../components/patient-scratch-pad';
import { DOB_FORMAT } from '../config';
import * as styles from '../css/components/patient-profile-scene.css';
import * as patientQuery from '../graphql/queries/get-patient.graphql';
import { ShortPatientFragment } from '../graphql/types';
import { IState as IAppState } from '../store';

export interface IProps {
  intl: InjectedIntl;
  patientId: string;
  loading: boolean;
  error?: string;
  patient?: ShortPatientFragment;
  match: {
    params: {
      patientId: string;
    };
  };
  updatePageParams: (tab: string) => any;
}

type SelectableTabs = 'encounters' | 'patientInfo';

export interface IState {
  selectedTab: SelectableTabs;
}

const GENDER: any = { F: 'Female', M: 'Male' };
const getPatientName = (patient: ShortPatientFragment) => (
  [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ')
);

function getPageParams() {
  return querystring.parse(window.location.search.substring(1));
}

class PatientProfileContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onTabClick = this.onTabClick.bind(this);

    const { tab } = getPageParams();

    this.state = {
      selectedTab: tab || 'encounters',
    };
  }

  componentWillReceiveProps(newProps: IProps) {
    const { tab } = getPageParams();
    this.setState(() => ({ selectedTab: tab || 'encounters' }));

    if (newProps.patient) {
      document.title = `${getPatientName(newProps.patient)} | Commons`;
    }
  }

  onTabClick(selectedTab: SelectableTabs) {
    const { updatePageParams } = this.props;

    updatePageParams(selectedTab);
    this.setState(() => ({ selectedTab }));
  }

  render() {
    const { patientId, patient, loading, error, intl } = this.props;
    const { selectedTab } = this.state;

    const name = patient ? getPatientName(patient) : null;
    const patientAge = patient && patient.dateOfBirth ?
      moment(patient.dateOfBirth, DOB_FORMAT).fromNow(true).replace('years', '') :
      'Unknown';
    const dateOfBirth = patient && patient.dateOfBirth ?
      intl.formatDate(patient.dateOfBirth) :
      'Unknown';
    const patientJoined = patient && patient.createdAt ?
      intl.formatRelative(patient.createdAt) :
      'Unknown';
    const gender = patient && patient.gender ? GENDER[patient.gender] : null;
    const zip = patient && patient.zip ? patient.zip : null;
    const language = patient && patient.language ? langs.where('1', patient.language).name : null;

    const encountersTabStyles = classNames(styles.tab, {
      [styles.selectedTab]: selectedTab === 'encounters',
    });
    const encountersPaneStyles = classNames(styles.pane, {
      [styles.selectedPane]: selectedTab === 'encounters',
    });
    const patientInfoTabStyles = classNames(styles.tab, {
      [styles.selectedTab]: selectedTab === 'patientInfo',
    });
    const patientInfoPaneStyles = classNames(styles.pane, {
      [styles.selectedPane]: selectedTab === 'patientInfo',
    });

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
                <div className={styles.patientSubheading}>{patientAge} • {gender}</div>
              </div>
            </div>
            <div className={styles.patientBasicInfo}>
              <div className={styles.patientBasicInfoRow}>
                <FormattedMessage id='patient.dateOfBirth'>
                  {(message: string) =>
                    <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
                </FormattedMessage>
                <div className={styles.patientBasicInfoRowData}>{dateOfBirth}</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <FormattedMessage id='patient.language'>
                  {(message: string) =>
                    <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
                </FormattedMessage>
                <div className={styles.patientBasicInfoRowData}>{language}</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <FormattedMessage id='patient.location'>
                  {(message: string) =>
                    <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
                </FormattedMessage>
                <div className={styles.patientBasicInfoRowData}>{zip}</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <FormattedMessage id='patient.joinedAt'>
                  {(message: string) =>
                    <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
                </FormattedMessage>
                <div className={styles.patientBasicInfoRowData}>{patientJoined}</div>
              </div>
              <div className={styles.patientBasicInfoRow}>
                <FormattedMessage id='patient.medicareId'>
                  {(message: string) =>
                    <div className={styles.patientBasicInfoRowTitle}>{message}:</div>}
                </FormattedMessage>
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
            <FormattedMessage id='patient.encounters'>
              {(message: string) =>
                <div
                  className={encountersTabStyles}
                  onClick={() => this.onTabClick('encounters')}>
                  {message}
                </div>}
            </FormattedMessage>
            <FormattedMessage id='patient.patientInfo'>
              {(message: string) =>
                <div
                  className={patientInfoTabStyles}
                  onClick={() => this.onTabClick('patientInfo')}>
                  {message}
                </div>}
            </FormattedMessage>
          </div>
          <div className={encountersPaneStyles}>
            <PatientEncounters patientId={patientId} />
          </div>
          <div className={patientInfoPaneStyles}>
            <PatientInfo patientId={patientId} patient={patient} loading={loading} error={error}/>
          </div>
        </div>
        <CareTeamWidget patientId={patientId} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    updatePageParams: (tab: string) => {
      dispatch(push({ search: querystring.stringify({ tab }) }));
    },
  };
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    patientId: ownProps.match.params.patientId,
  };
}

export default compose(
  injectIntl,
  connect(undefined, mapDispatchToProps),
  connect(mapStateToProps),
  graphql(patientQuery as any, {
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
