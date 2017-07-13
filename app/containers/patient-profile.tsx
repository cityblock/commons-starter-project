import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PatientEncounters from '../components/patient-encounters';
import PatientInfo from '../components/patient-info';
import PatientProfileLeftNav from '../components/patient-profile-left-nav';
import PatientTasks from '../components/patient-tasks';
import * as styles from '../css/components/patient-profile-scene.css';
import * as tabStyles from '../css/shared/tabs.css';
import * as patientQuery from '../graphql/queries/get-patient.graphql';
import { ShortPatientFragment } from '../graphql/types';
import { Size } from '../reducers/browser-reducer';
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
  browserSize: Size;
  match: {
    params: {
      patientId: string;
      tabId?: SelectableTabs;
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
    const { patientId, patient, loading, error, intl, tabId, taskId, browserSize } = this.props;

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

    return (
      <div className={styles.container}>
        <PatientProfileLeftNav
          browserSize={browserSize}
          intl={intl}
          patientId={patientId}
          patient={patient} />
        <div className={mainBodyStyle}>
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
          <Route path={`/patients/${patientId}/encounters`} component={() => (
            <PatientEncounters patientId={patientId} />
          )} />
          <Route path={`/patients/${patientId}/patientInfo`} component={() => (
            <PatientInfo patientId={patientId} patient={patient} loading={loading} error={error} />
          )} />
          <Route path={`/patients/${patientId}/tasks`} component={() => (
            <PatientTasks patientId={patientId} taskId={taskId} />
          )} />
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
