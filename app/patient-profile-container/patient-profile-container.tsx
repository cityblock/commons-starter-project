import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as patientQuery from '../graphql/queries/get-patient.graphql';
import { getPatientQuery } from '../graphql/types';
import patientGlassBreak, { IInjectedProps } from '../shared/glass-break/patient-glass-break';
import { formatPatientName } from '../shared/helpers/format-helpers';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import { IState as IAppState } from '../store';
import PatientCalendar from './calendar/patient-calendar';
import * as styles from './css/patient-profile.css';
import PatientCarePlanView from './patient-care-plan-view';
import PatientInfo from './patient-info/patient-info';
import PatientIntakeChecklist from './patient-intake-checklist';
import PatientModals from './patient-modals';
import PatientProfileLeftNav from './patient-profile-left-nav';
import PatientTeam from './patient-team/patient-team';
import PatientThreeSixtyView from './patient-three-sixty/patient-three-sixty-view';
import ScreeningTool from './screening-tool/screening-tool';
import PatientTimeline from './timeline/patient-timeline';

export type SelectableTabs =
  | 'timeline'
  | 'member-info'
  | '360'
  | 'map'
  | 'tasks'
  | 'tools'
  | 'team'
  | 'calendar';

interface IProps extends IInjectedProps {
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
}

interface IGraphqlProps {
  loading: boolean;
  error?: string | null;
  patient?: getPatientQuery['patient'];
}

type allProps = IStateProps & IProps & IGraphqlProps;

export class PatientProfileContainer extends React.Component<allProps> {
  componentWillReceiveProps(newProps: allProps) {
    if (newProps.patient) {
      document.title = `${formatPatientName(newProps.patient)} | Commons`;
    }
  }

  render() {
    const { patientId, patient, tab, glassBreakId } = this.props;
    return (
      <div className={styles.container}>
        <PatientModals />
        <PatientProfileLeftNav
          patientId={patientId}
          patient={patient || null}
          glassBreakId={glassBreakId}
        />
        <div className={styles.mainBody}>
          <div className={styles.header}>
            <PatientIntakeChecklist patientId={patientId} />
            <UnderlineTabs color="white" className={styles.tabs}>
              <UnderlineTab
                messageId="patient.threeSixty"
                href={`/patients/${patientId}/360`}
                selected={tab === '360'}
              />
              <UnderlineTab
                messageId="patient.map"
                selected={tab === 'map'}
                href={`/patients/${patientId}/map/active`}
              />
              <UnderlineTab
                messageId="patient.timeline"
                selected={tab === 'timeline'}
                href={`/patients/${patientId}/timeline`}
              />
              <UnderlineTab
                messageId="patient.patientInfo"
                href={`/patients/${patientId}/member-info`}
                selected={tab === 'member-info'}
              />
              <UnderlineTab
                messageId="patient.patientTeam"
                href={`/patients/${patientId}/team`}
                selected={tab === 'team'}
              />
              <UnderlineTab
                messageId="patient.patientCalendar"
                href={`/patients/${patientId}/calendar`}
                selected={tab === 'calendar'}
              />
            </UnderlineTabs>
          </div>
          <div className={styles.pageContent}>
            <Switch>
              <Route
                exact
                path="/patients/:patientId/map/:subTab?(/tasks/:taskId)?"
                render={(props: any) => (
                  <PatientCarePlanView {...props} glassBreakId={glassBreakId} />
                )}
              />
              <Route
                exact
                path="/patients/:patientId/360/:riskAreaGroupId?(/assessment/:riskAreaId)?"
                render={(props: any) => (
                  <PatientThreeSixtyView {...props} glassBreakId={glassBreakId} />
                )}
              />
              <Route
                exact
                path="/patients/:patientId/tools/:screeningToolId?"
                component={ScreeningTool}
              />
              <Route
                exact
                path="/patients/:patientId/timeline"
                render={(props: any) => <PatientTimeline {...props} glassBreakId={glassBreakId} />}
              />
              <Route
                exact
                path="/patients/:patientId/member-info/:subTab?"
                render={(props: any) => <PatientInfo {...props} glassBreakId={glassBreakId} />}
              />
              <Route exact path="/patients/:patientId/team/:subTab?" component={PatientTeam} />
              <Route
                exact
                path="/patients/:patientId/calendar"
                render={(props: any) => <PatientCalendar {...props} />}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
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
  patientGlassBreak(),
)(PatientProfileContainer);
