import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as patientQuery from '../graphql/queries/get-patient.graphql';
import { getPatientQuery } from '../graphql/types';
import { Size } from '../reducers/browser-reducer';
import patientGlassBreak, { IInjectedProps } from '../shared/glass-break/patient-glass-break';
import { formatPatientName } from '../shared/helpers/format-helpers';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import { IState as IAppState } from '../store';
import * as styles from './css/patient-profile.css';
import PatientCarePlanView from './patient-care-plan-view';
import PatientInfo from './patient-info/patient-info';
import PatientIntakeChecklist from './patient-intake-checklist';
import PatientProfileLeftNav from './patient-profile-left-nav';
import PatientThreeSixtyView from './patient-three-sixty/patient-three-sixty-view';
import ScreeningTool from './screening-tool/screening-tool';
import PatientTimeline from './timeline/patient-timeline';

export type SelectableTabs = 'timeline' | 'patientInfo' | '360' | 'map' | 'tasks' | 'tools';

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
  browserSize: Size;
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
    const { patientId, patient, tab, browserSize } = this.props;
    const mainBodyStyle = classNames({
      [styles.mainBody]: browserSize === 'large',
      [styles.mainBodySmall]: browserSize === 'small',
    });
    return (
      <div className={styles.container}>
        <PatientProfileLeftNav browserSize={browserSize} patientId={patientId} patient={patient} />
        <div className={mainBodyStyle}>
          <PatientIntakeChecklist patientId={patientId} />
          <UnderlineTabs color="white">
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
              href={`/patients/${patientId}/patientInfo`}
              selected={tab === 'patientInfo'}
            />
          </UnderlineTabs>
          <Switch>
            <Route
              exact
              path="/patients/:patientId/map/:subTab?(/tasks/:taskId)?"
              component={PatientCarePlanView as any}
            />
            <Route
              exact
              path="/patients/:patientId/360/:riskAreaGroupId?(/assessment/:riskAreaId)?"
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
  patientGlassBreak(),
)(PatientProfileContainer);
