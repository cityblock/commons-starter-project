import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as patientQuery from '../graphql/queries/get-patient.graphql';
import { ShortPatientFragment } from '../graphql/types';
import { Size } from '../reducers/browser-reducer';
import * as tabStyles from '../shared/css/tabs.css';
import { IState as IAppState } from '../store';
import * as styles from './css/patient-profile.css';
import PatientCarePlanView from './patient-care-plan-view';
import PatientEncounters from './patient-encounters';
import PatientInfo from './patient-info';
import PatientProfileLeftNav from './patient-profile-left-nav';
import PatientTasks from './patient-tasks';
import PatientThreeSixtyView from './patient-three-sixty-view';

type SelectableTabs = 'encounters' | 'patientInfo' | 'tasks' | '360' | 'carePlan';

interface IProps {
  intl: InjectedIntl;
  patientId: string;
  taskId?: string;
  tabId: SelectableTabs;
  loading: boolean;
  error?: string;
  patient?: ShortPatientFragment;
  browserSize: Size;
  match: {
    params: {
      patientId: string;
      tabId?: SelectableTabs;
      riskAreaOrSubTabId?: string;
    };
  };
}

export const getPatientName = (patient: ShortPatientFragment) => (
  [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ')
);

class PatientProfileContainer extends React.Component<IProps, {}> {

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.patient) {
      document.title = `${getPatientName(newProps.patient)} | Commons`;
    }
  }

  render() {
    const {
      patientId,
      patient,
      loading,
      error,
      intl,
      tabId,
      taskId,
      browserSize,
      match,
    } = this.props;

    const threeSixtyViewTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === '360',
    });
    const carePlanTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'carePlan',
    });
    const encountersTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'encounters',
    });
    const patientInfoTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'patientInfo',
    });
    const tasksTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'tasks',
    });

    const mainBodyStyle = classNames({
      [styles.mainBody]: browserSize === 'large',
      [styles.mainBodySmall]: browserSize === 'small',
    });
    const encounters = tabId === 'encounters' ? <PatientEncounters patientId={patientId} /> : null;
    const patientInfo = tabId === 'patientInfo' ?
      <PatientInfo patientId={patientId} patient={patient} loading={loading} error={error} /> :
      null;
    const tasks = tabId === 'tasks' ?
      <PatientTasks patient={patient} taskId={taskId} patientId={patientId} /> :
      null;
    const threeSixty = tabId === '360' ?
      <PatientThreeSixtyView
        riskAreaId={match.params.riskAreaOrSubTabId}
        patientId={patientId}
        routeBase={`/patients/${patientId}/360`} /> : null;
    const carePlan = tabId === 'carePlan' ?
      <PatientCarePlanView
        patientId={patientId}
        routeBase={`/patients/${patientId}/carePlan`}
        subTabId={match.params.riskAreaOrSubTabId as any} /> : null; // TODO: Fix typing
    return (
      <div className={styles.container}>
        <PatientProfileLeftNav
          browserSize={browserSize}
          intl={intl}
          patientId={patientId}
          patient={patient} />
        <div className={mainBodyStyle}>
          <div className={tabStyles.tabs}>
            <FormattedMessage id='patient.threeSixty'>
              {(message: string) =>
                <Link
                  to={`/patients/${patientId}/360`}
                  className={threeSixtyViewTabStyles}>
                  {message}
                </Link>}
            </FormattedMessage>
            <FormattedMessage id='patient.carePlan'>
              {(message: string) =>
                <Link
                  to={`/patients/${patientId}/carePlan`}
                  className={carePlanTabStyles}>
                  {message}
                </Link>}
            </FormattedMessage>
            <FormattedMessage id='patient.encounters'>
              {(message: string) =>
                <Link
                  to={`/patients/${patientId}/encounters`}
                  className={encountersTabStyles}>
                  {message}
                </Link>}
            </FormattedMessage>
            <FormattedMessage id='patient.patientInfo'>
              {(message: string) =>
                <Link
                  to={`/patients/${patientId}/patientInfo`}
                  className={patientInfoTabStyles}>
                  {message}
                </Link>}
            </FormattedMessage>
            <FormattedMessage id='patient.tasks'>
              {(message: string) =>
                <Link
                  to={`/patients/${patientId}/tasks`}
                  className={tasksTabStyles}>
                  {message}
                </Link>}
            </FormattedMessage>
          </div>
          {encounters}
          {patientInfo}
          {tasks}
          {threeSixty}
          {carePlan}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  const { browser } = state;
  return {
    browserSize: browser ? browser.size : 'large',
    patientId: ownProps.match.params.patientId,
    tabId: ownProps.match.params.tabId || 'encounters',
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
