import * as classNames from 'classnames';
import * as langs from 'langs';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CareTeamWidget from '../components/care-team-widget';
import PatientEncounters from '../components/patient-encounters';
import PatientInfo from '../components/patient-info';
import PatientMedications from '../components/patient-medications';
import PatientScratchPad from '../components/patient-scratch-pad';
import PatientTasks from '../components/patient-tasks';
import { DOB_FORMAT } from '../config';
import * as styles from '../css/components/patient-profile-scene.css';
import * as tabStyles from '../css/shared/tabs.css';
import * as patientQuery from '../graphql/queries/get-patient.graphql';
import { ShortPatientFragment } from '../graphql/types';
import { IState as IAppState } from '../store';

type SelectableTabs = 'encounters' | 'patientInfo' | 'tasks';

export interface IProps {
  intl: InjectedIntl;
  patientId: string;
  taskId?: string;
  tabId: SelectableTabs;
  loading: boolean;
  error?: string;
  patient?: ShortPatientFragment;
  match: {
    params: {
      patientId: string;
      tabId?: SelectableTabs;
      taskId?: string;
    };
  };
}

const GENDER: any = { F: 'Female', M: 'Male' };
const getPatientName = (patient: ShortPatientFragment) => (
  [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ')
);

class PatientProfileContainer extends React.Component<IProps, {}> {

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.patient) {
      document.title = `${getPatientName(newProps.patient)} | Commons`;
    }
  }

  render() {
    const { patientId, patient, loading, error, intl, tabId, taskId } = this.props;

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

    const encountersTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'encounters',
    });
    const encountersPaneStyles = classNames(tabStyles.pane, {
      [tabStyles.selectedPane]: tabId === 'encounters',
    });
    const patientInfoTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'patientInfo',
    });
    const patientInfoPaneStyles = classNames(tabStyles.pane, {
      [tabStyles.selectedPane]: tabId === 'patientInfo',
    });
    const tasksTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'tasks',
    });
    const tasksPaneStyles = classNames(tabStyles.pane, {
      [tabStyles.selectedPane]: tabId === 'tasks',
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
          <CareTeamWidget patientId={patientId} />
        </div>
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <FormattedMessage id='patient.encounters'>
              {(message: string) =>
                <Link to={`/patients/${patientId}/encounters`}
                  className={encountersTabStyles}>
                  {message}
                </Link>}
            </FormattedMessage>
            <FormattedMessage id='patient.patientInfo'>
              {(message: string) =>
                <Link to={`/patients/${patientId}/patientInfo`}
                  className={patientInfoTabStyles}>
                  {message}
                </Link>}
            </FormattedMessage>
            <FormattedMessage id='patient.tasks'>
              {(message: string) =>
                <Link to={`/patients/${patientId}/tasks`}
                  className={tasksTabStyles}>
                  {message}
                </Link>}
            </FormattedMessage>
          </div>
          <div className={encountersPaneStyles}>
            <PatientEncounters patientId={patientId} />
          </div>
          <div className={patientInfoPaneStyles}>
            <PatientInfo patientId={patientId} patient={patient} loading={loading} error={error} />
          </div>
          <div className={tasksPaneStyles}>
            <PatientTasks patientId={patientId} taskId={taskId} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    patientId: ownProps.match.params.patientId,
    tabId: ownProps.match.params.tabId || 'encounters',
    taskId: ownProps.match.params.taskId,
  };
}

export default compose(
  injectIntl,
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
