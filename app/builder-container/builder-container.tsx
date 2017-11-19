import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import {
  FullConcernFragment,
  FullGoalSuggestionTemplateFragment,
  FullProgressNoteTemplateFragment,
  FullRiskAreaFragment,
  FullScreeningToolFragment,
} from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import { IState as IAppState } from '../store';
import BuilderConcerns from './builder-concerns';
import BuilderGoals from './builder-goals';
import BuilderProgressNoteTemplates from './builder-progress-note-templates';
import BuilderQuestions from './builder-questions';
import BuilderRiskAreas from './builder-risk-areas';
import BuilderScreeningTools from './builder-screening-tools';
import * as styles from './css/builder.css';

type Tab = 'domains' | 'concerns' | 'goals' | 'tools' | 'progress-note-templates';

interface IProps {
  mutate?: any;
  match: {
    params: {
      tab?: Tab;
      objectId?: string;
      subTab?: 'questions';
    };
  };
}

interface IStateProps {
  tab: Tab;
  objectId?: string;
  subTab?: string;
}

interface IGraphqlProps {
  screeningToolId?: string;
  riskAreasLoading: boolean;
  riskAreasError?: string;
  screeningToolsLoading: boolean;
  screeningToolsError?: string;
  concernsLoading: boolean;
  concernsError?: string;
  goalsLoading: boolean;
  goalsError?: string;
  refetchGoals: () => any;
  riskAreas: FullRiskAreaFragment[];
  concerns: FullConcernFragment[];
  goals: FullGoalSuggestionTemplateFragment[];
  screeningTools: FullScreeningToolFragment[];
  progressNoteTemplates: FullProgressNoteTemplateFragment[];
}

type allProps = IProps & IGraphqlProps & IStateProps;

class BuilderContainer extends React.Component<allProps, {}> {
  render() {
    const { subTab, tab } = this.props;
    const questionsTabSelected = subTab === 'questions';
    const concernsTabSelected = tab === 'concerns';
    const goalsTabSelected = tab === 'goals';
    const progressNoteTemplatesTabSelected =
      tab === 'progress-note-templates' && subTab !== 'questions';
    const toolsTabSelected = tab === 'tools' && subTab !== 'questions';
    const riskAreasTabSelected =
      !questionsTabSelected &&
      !concernsTabSelected &&
      !goalsTabSelected &&
      !toolsTabSelected &&
      !progressNoteTemplatesTabSelected;
    const riskAreaTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: riskAreasTabSelected,
    });
    const questionTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: questionsTabSelected,
    });
    const concernTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: concernsTabSelected,
    });
    const goalTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: goalsTabSelected,
    });
    const progressNoteTemplatesTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: progressNoteTemplatesTabSelected,
    });
    const toolTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: toolsTabSelected,
    });
    return (
      <div className={styles.container}>
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <Link to={'/builder/domains'} className={riskAreaTabStyles}>
              Domains
            </Link>
            <Link to={`/builder/domains/redirect/questions`} className={questionTabStyles}>
              Questions
            </Link>
            <Link to={'/builder/concerns'} className={concernTabStyles}>
              Concerns
            </Link>
            <Link to={'/builder/goals'} className={goalTabStyles}>
              Goals
            </Link>
            <Link to={'/builder/tools'} className={toolTabStyles}>
              Tools
            </Link>
            <Link
              to={'/builder/progress-note-templates'}
              className={progressNoteTemplatesTabStyles}
            >
              Progress Note Templates
            </Link>
          </div>
          <Switch>
            <Route
              exact
              path="/builder/domains/:riskAreaId/questions/:questionId?"
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
            <Route exact path="/builder/domains/:riskAreaId?" component={BuilderRiskAreas} />
            <Route exact path="/builder/tools/:toolId?" component={BuilderScreeningTools} />
            <Route exact path="/builder/concerns/:concernId?" component={BuilderConcerns} />
            <Route exact path="/builder/goals/:goalId?" component={BuilderGoals} />
            <Route
              exact
              path="/builder/progress-note-templates/:progressNoteTemplateId?"
              component={BuilderProgressNoteTemplates}
            />
            <Redirect to="/builder/domains" />
          </Switch>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    tab: ownProps.match.params.tab || 'domains',
    objectId: ownProps.match.params.objectId,
    subTab: ownProps.match.params.subTab,
  };
}

export default connect<IStateProps, {}, IProps>(mapStateToProps)(BuilderContainer);
