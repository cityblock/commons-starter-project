import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import patientGraphql from '../graphql/queries/get-patient.graphql';
import { getPatient } from '../graphql/types';
import ProgressNotePopupContainer from '../progress-note-container/progress-note-popup-container';
import ErrorComponent from '../shared/error-component/error-component';
import patientGlassBreak, { IInjectedProps } from '../shared/glass-break/patient-glass-break';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import { IState as IAppState } from '../store';
import PatientCalendar from './calendar/patient-calendar';
import styles from './css/patient-profile.css';
import PatientCarePlanView from './patient-care-plan-view';
import PatientInfo from './patient-info/patient-info';
import PatientIntakeChecklist from './patient-intake-checklist';
import PatientModals from './patient-modals';
import PatientProfileLeftNav from './patient-profile-left-nav';
import PatientTeam from './patient-team/patient-team';
import DomainAssessments from './patient-three-sixty/domain-assessments';
import PatientThreeSixtyDomains from './patient-three-sixty/patient-three-sixty-domains';
import PatientThreeSixtyHistory from './patient-three-sixty/patient-three-sixty-history';
import RiskAreaAssessment from './risk-area/risk-area-assessment';
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
  error?: ApolloError | null;
  patient?: getPatient['patient'];
}

type allProps = IStateProps & IProps & IGraphqlProps;

export const PatientProfileContainer = (props: allProps) => {
  const { patientId, patient, tab, glassBreakId, error } = props;

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div className={styles.container}>
      <PatientModals />
      <PatientProfileLeftNav
        patientId={patientId}
        patient={patient || null}
        glassBreakId={glassBreakId}
      />
      <ProgressNotePopupContainer patientId={patientId} />
      <div className={styles.mainBody}>
        <PatientIntakeChecklist patientId={patientId} />
        <div className={styles.header}>
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
        <React.Fragment>
          <Switch>
            <Route
              exact
              path="/patients/:patientId/map/:subTab?(/goals/:goalId)?(/tasks/:taskId)?"
              render={(p: any) => <PatientCarePlanView {...p} glassBreakId={glassBreakId} />}
            />
            <Route
              exact
              path="/patients/:patientId/360/:riskAreaGroupId/assessment/:riskAreaId"
              render={(p: any) => (
                <RiskAreaAssessment
                  {...p}
                  routeBase={`/patients/${patientId}/360`}
                  riskAreaGroupId={p.match.params.riskAreaGroupId}
                  riskAreaId={p.match.params.riskAreaId}
                  patientId={patientId}
                  glassBreakId={glassBreakId}
                />
              )}
            />
            <Route
              exact
              path="/patients/:patientId/360/history"
              render={(p: any) => (
                <PatientThreeSixtyHistory
                  {...p}
                  patientId={patientId}
                  glassBreakId={glassBreakId}
                />
              )}
            />
            <Route
              exact
              path="/patients/:patientId/360/:riskAreaGroupId"
              render={(p: any) => (
                <DomainAssessments
                  {...p}
                  routeBase={`/patients/${patientId}/360`}
                  riskAreaGroupId={p.match.params.riskAreaGroupId}
                  riskAreaId={p.match.params.riskAreaId}
                  patientId={patientId}
                  glassBreakId={glassBreakId}
                />
              )}
            />
            <Route
              exact
              path="/patients/:patientId/360"
              render={(p: any) => (
                <PatientThreeSixtyDomains
                  {...p}
                  patientId={patientId}
                  glassBreakId={glassBreakId}
                />
              )}
            />
            <Route
              exact
              path="/patients/:patientId/tools/:screeningToolId?"
              component={ScreeningTool}
            />
            <Route
              exact
              path="/patients/:patientId/tools/:screeningToolId/submission/:submissionId"
              component={ScreeningTool}
            />
            <Route
              exact
              path="/patients/:patientId/timeline"
              render={(p: any) => <PatientTimeline {...p} glassBreakId={glassBreakId} />}
            />
            <Route
              exact
              path="/patients/:patientId/member-info/:subTab?"
              render={(p: any) => <PatientInfo {...p} glassBreakId={glassBreakId} />}
            />
            <Route exact path="/patients/:patientId/team/:subTab?" component={PatientTeam} />
            <Route
              exact
              path="/patients/:patientId/calendar"
              render={(p: any) => <PatientCalendar {...p} />}
            />
          </Switch>
        </React.Fragment>
      </div>
    </div>
  );
};

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    patientId: ownProps.match.params.patientId,
    tab: ownProps.match.params.tab,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(patientGraphql, {
    options: (props: IProps & IStateProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }): IGraphqlProps => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patient: data ? (data as any).patient : null,
    }),
  }),
  patientGlassBreak(),
)(PatientProfileContainer);
