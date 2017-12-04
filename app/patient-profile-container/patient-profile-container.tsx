import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import * as patientQuery from '../graphql/queries/get-patient.graphql';
import { getPatientQuery, ShortPatientFragment } from '../graphql/types';
import { Size } from '../reducers/browser-reducer';
import * as tabStyles from '../shared/css/tabs.css';
import { IState as IAppState } from '../store';
import * as styles from './css/patient-profile.css';
import PatientCarePlanView from './patient-care-plan-view';
import PatientInfo from './patient-info';
import PatientProfileLeftNav from './patient-profile-left-nav';
import PatientThreeSixtyView from './patient-three-sixty-view';
import ScreeningTool from './screening-tool';
import PatientTimeline from './timeline/patient-timeline';

export type SelectableTabs = 'timeline' | 'patientInfo' | '360' | 'map' | 'tasks' | 'tools';

interface IProps {
  match: {
    params: {
      patientId: string;
      tab?: SelectableTabs;
    };
  };
}

interface IStateProps {
  patientId: string;
  tab?: SelectableTabs;
  browserSize: Size;
}

interface IGraphqlProps {
  loading: boolean;
  error?: string;
  patient?: getPatientQuery['patient'];
}

type allProps = IStateProps & IProps & IGraphqlProps;

export const getPatientName = (patient: ShortPatientFragment) =>
  [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ');

export class PatientProfileContainer extends React.Component<allProps> {
  componentWillReceiveProps(newProps: allProps) {
    if (newProps.patient) {
      document.title = `${getPatientName(newProps.patient)} | Commons`;
    }
  }

  render() {
    const { patientId, patient, tab, browserSize } = this.props;

    const threeSixtyViewTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === '360',
    });
    const mapTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'map',
    });
    const timelineTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'timeline',
    });
    const patientInfoTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tab === 'patientInfo',
    });
    const mainBodyStyle = classNames({
      [styles.mainBody]: browserSize === 'large',
      [styles.mainBodySmall]: browserSize === 'small',
    });
    return (
      <div className={styles.container}>
        <PatientProfileLeftNav browserSize={browserSize} patientId={patientId} patient={patient} />
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
                <Link to={`/patients/${patientId}/map/active`} className={mapTabStyles}>
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
          <Switch>
            <Route
              exact
              path="/patients/:patientId/map/:subTab"
              component={PatientCarePlanView as any}
            />
            <Route
              exact
              path="/patients/:patientId/map/:subTab/tasks/:taskId"
              component={PatientCarePlanView as any}
            />
            <Route
              exact
              path="/patients/:patientId/360/:riskAreaId?"
              component={PatientThreeSixtyView as any}
            />
            <Route
              exact
              path="/patients/:patientId/tools/:screeningToolId?"
              component={ScreeningTool}
            />
            <Route exact path="/patients/:patientId/timeline" component={PatientTimeline} />
            <Route exact path="/patients/:patientId/patientInfo" component={PatientInfo} />
          </Switch>
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
    tab: ownProps.match.params.tab,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql<IGraphqlProps, IProps & IStateProps, allProps>(patientQuery as any, {
    options: (props: IProps & IStateProps) => ({
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
