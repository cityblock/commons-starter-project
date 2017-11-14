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
import PatientInfo from './patient-info';
import PatientProfileLeftNav from './patient-profile-left-nav';
import PatientThreeSixtyView from './patient-three-sixty-view';
import PatientTimeline from './patient-timeline';
import ScreeningTool from './screening-tool';

type SelectableTabs = 'timeline' | 'patientInfo' | '360' | 'map' | 'tasks' | 'tools';

interface IStateProps {
  patientId: string;
  tabId: SelectableTabs;
  browserSize: Size;
}

interface IProps extends IStateProps {
  intl: InjectedIntl;
  loading: boolean;
  error?: string;
  patient?: ShortPatientFragment;
  match: {
    params: {
      patientId: string;
      tabId?: SelectableTabs;
      riskAreaOrSubTabId?: string;
    };
  };
}

export const getPatientName = (patient: ShortPatientFragment) =>
  [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ');

class PatientProfileContainer extends React.Component<IProps, {}> {
  componentWillReceiveProps(newProps: IProps) {
    if (newProps.patient) {
      document.title = `${getPatientName(newProps.patient)} | Commons`;
    }
  }

  render() {
    const { patientId, patient, loading, error, intl, tabId, browserSize, match } = this.props;

    const threeSixtyViewTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === '360',
    });
    const mapTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'map',
    });
    const timelineTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'timeline',
    });
    const patientInfoTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'patientInfo',
    });
    const mainBodyStyle = classNames({
      [styles.mainBody]: browserSize === 'large',
      [styles.mainBodySmall]: browserSize === 'small',
    });
    const tools =
      tabId === 'tools' && match.params.riskAreaOrSubTabId ? (
        <ScreeningTool
          screeningToolId={match.params.riskAreaOrSubTabId}
          patientId={patientId}
          patientRoute={`/patients/${patientId}`}
        />
      ) : null;
    const timeline = tabId === 'timeline' ? <PatientTimeline patientId={patientId} /> : null;
    const patientInfo =
      tabId === 'patientInfo' ? (
        <PatientInfo patientId={patientId} patient={patient} loading={loading} error={error} />
      ) : null;
    const threeSixty =
      tabId === '360' ? (
        <PatientThreeSixtyView
          riskAreaId={match.params.riskAreaOrSubTabId}
          patientId={patientId}
          patientRoute={`/patients/${patientId}`}
          routeBase={`/patients/${patientId}/360`}
        />
      ) : null;
    const map =
      tabId === 'map' || tabId === 'tasks' ? (
        <PatientCarePlanView
          patientId={patientId}
          routeBase={`/patients/${patientId}/map`}
          subTabId={match.params.riskAreaOrSubTabId as any}
        />
      ) : null;
    return (
      <div className={styles.container}>
        <PatientProfileLeftNav
          browserSize={browserSize}
          intl={intl}
          patientId={patientId}
          patient={patient}
        />
        <div className={mainBodyStyle}>
          <div className={tabStyles.tabs}>
            <FormattedMessage id="patient.threeSixty">
              {(message: string) => (
                <Link to={`/patients/${patientId}/360`} className={threeSixtyViewTabStyles}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
            <FormattedMessage id="patient.map">
              {(message: string) => (
                <Link to={`/patients/${patientId}/map`} className={mapTabStyles}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
            <FormattedMessage id="patient.timeline">
              {(message: string) => (
                <Link to={`/patients/${patientId}/timeline`} className={timelineTabStyles}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
            <FormattedMessage id="patient.patientInfo">
              {(message: string) => (
                <Link to={`/patients/${patientId}/patientInfo`} className={patientInfoTabStyles}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
          </div>
          {map}
          {patientInfo}
          {threeSixty}
          {timeline}
          {tools}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  const { browser } = state;
  return {
    browserSize: browser ? browser.size : 'large',
    patientId: ownProps.match.params.patientId,
    tabId: ownProps.match.params.tabId || 'map',
  };
}

export default compose(
  injectIntl,
  connect<IStateProps, {}, IProps>(mapStateToProps),
  graphql(patientQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patient: data ? (data as any).patient : null,
    }),
  }),
)(PatientProfileContainer);
