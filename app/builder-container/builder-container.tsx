import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  FullConcernFragment,
  FullGoalSuggestionTemplateFragment,
  FullProgressNoteTemplateFragment,
  FullRiskAreaFragment,
  FullScreeningToolFragment,
} from '../graphql/types';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import { IState as IAppState } from '../store';
import BuilderCBOs from './builder-cbos/builder-cbos';
import BuilderComputedFields from './builder-computed-fields';
import BuilderConcerns from './builder-concerns';
import BuilderGoals from './builder-goals';
import BuilderPatientLists from './builder-patient-lists/builder-patient-lists';
import BuilderProgressNoteTemplates from './builder-progress-note-templates';
import BuilderQuestions from './builder-questions';
import BuilderRiskAreaGroups from './builder-risk-area-groups/builder-risk-area-groups';
import BuilderRiskAreas from './builder-risk-areas';
import BuilderScreeningTools from './builder-screening-tools';
import * as styles from './css/builder.css';

type Tab =
  | 'domains'
  | 'assessments'
  | 'concerns'
  | 'goals'
  | 'tools'
  | 'progress-note-templates'
  | 'computed-fields'
  | 'patient-lists'
  | 'CBOs';

interface IProps {
  mutate?: any;
  match: {
    params: {
      tab?: Tab;
      objectId: string | null;
      subTab?: 'questions';
    };
  };
}

interface IStateProps {
  tab: Tab;
  objectId: string | null;
  subTab: string | null;
}

interface IGraphqlProps {
  screeningToolId: string | null;
  assessmentsLoading: boolean;
  assessmentsError: string | null;
  screeningToolsLoading: boolean;
  screeningToolsError: string | null;
  concernsLoading: boolean;
  concernsError: string | null;
  goalsLoading: boolean;
  goalsError: string | null;
  refetchGoals: () => any;
  assessments: FullRiskAreaFragment[];
  concerns: FullConcernFragment[];
  goals: FullGoalSuggestionTemplateFragment[];
  screeningTools: FullScreeningToolFragment[];
  progressNoteTemplates: FullProgressNoteTemplateFragment[];
}

type allProps = IProps & IGraphqlProps & IStateProps;

export class BuilderContainer extends React.Component<allProps, {}> {
  title = 'Builder';

  componentDidMount() {
    document.title = `${this.title} | Commons`;
  }

  render() {
    const { subTab, tab } = this.props;

    if (process.env.IS_BUILDER_ENABLED !== 'true') {
      return null;
    }

    const riskAreaGroupsTabSelected = tab === 'domains';
    const questionsTabSelected = subTab === 'questions';
    const concernsTabSelected = tab === 'concerns';
    const computedFieldsTabSelected = tab === 'computed-fields';
    const goalsTabSelected = tab === 'goals';
    const progressNoteTemplatesTabSelected =
      tab === 'progress-note-templates' && subTab !== 'questions';
    const toolsTabSelected = tab === 'tools' && subTab !== 'questions';
    const patientListsTabSelected = tab === 'patient-lists';
    const CBOsTabSelected = tab === 'CBOs';
    const assessmentsTabSelected =
      !riskAreaGroupsTabSelected &&
      !questionsTabSelected &&
      !concernsTabSelected &&
      !goalsTabSelected &&
      !toolsTabSelected &&
      !progressNoteTemplatesTabSelected &&
      !computedFieldsTabSelected &&
      !patientListsTabSelected &&
      !CBOsTabSelected;
    return (
      <div className={styles.container}>
        <div className={styles.mainBody}>
          <UnderlineTabs color="white">
            <UnderlineTab
              href={'/builder/domains'}
              selected={riskAreaGroupsTabSelected}
              messageId="builder.domains"
            />
            <UnderlineTab
              href={'/builder/assessments'}
              selected={assessmentsTabSelected}
              messageId="builder.assessments"
            />
            <UnderlineTab
              href={`/builder/assessments/redirect/questions`}
              selected={questionsTabSelected}
              messageId="builder.questions"
            />
            <UnderlineTab
              href={'/builder/concerns'}
              messageId="builder.concerns"
              selected={concernsTabSelected}
            />
            <UnderlineTab
              href={'/builder/goals'}
              messageId="builder.goals"
              selected={goalsTabSelected}
            />
            <UnderlineTab
              href={'/builder/tools'}
              messageId="builder.tools"
              selected={toolsTabSelected}
            />
            <UnderlineTab
              href={'/builder/progress-note-templates'}
              messageId="builder.progressNoteTemplates"
              selected={progressNoteTemplatesTabSelected}
            />
            <UnderlineTab
              href={'/builder/computed-fields'}
              messageId="builder.computedFields"
              selected={computedFieldsTabSelected}
            />
            <UnderlineTab
              href="/builder/patient-lists"
              messageId="builder.patientLists"
              selected={patientListsTabSelected}
            />
            <UnderlineTab
              href="/builder/CBOs"
              messageId="builder.CBOs"
              selected={CBOsTabSelected}
            />
          </UnderlineTabs>
          <Switch>
            <Route
              exact
              path="/builder/assessments/:riskAreaId/questions/:questionId?"
              component={BuilderQuestions}
            />
            <Route
              exact
              path="/builder/tools/:toolId/questions/:questionId?"
              component={BuilderQuestions}
            />
            <Route
              exact
              path="/builder/progress-note-templates/:progressNoteTemplateId/questions/:questionId?"
              component={BuilderQuestions}
            />
            <Route
              exact
              path="/builder/domains/:riskAreaGroupId?"
              component={BuilderRiskAreaGroups}
            />
            <Route exact path="/builder/assessments/:riskAreaId?" component={BuilderRiskAreas} />
            <Route exact path="/builder/tools/:toolId?" component={BuilderScreeningTools} />
            <Route exact path="/builder/concerns/:concernId?" component={BuilderConcerns} />
            <Route exact path="/builder/goals/:goalId?" component={BuilderGoals} />
            <Route
              exact
              path="/builder/progress-note-templates/:progressNoteTemplateId?"
              component={BuilderProgressNoteTemplates}
            />
            <Route
              exact
              path="/builder/computed-fields/:computedFieldId?"
              component={BuilderComputedFields}
            />
            <Route
              exact
              path="/builder/patient-lists/:patientListId?"
              component={BuilderPatientLists}
            />
            <Route exact path="/builder/CBOs/:CBOId?" component={BuilderCBOs} />
            <Redirect to="/builder/domains" />
          </Switch>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    tab: ownProps.match.params.tab || 'assessments',
    objectId: ownProps.match.params.objectId,
    subTab: ownProps.match.params.subTab || null,
  };
}

export default connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps)(
  BuilderContainer,
);
