import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as concernsQuery from '../graphql/queries/get-concerns.graphql';
import * as goalsQuery from '../graphql/queries/get-goal-suggestion-templates.graphql';
/* tslint:disable:max-line-length */
import * as progressNoteTemplatesQuery from '../graphql/queries/get-progress-note-templates.graphql';
/* tslint:enable:max-line-length */
import * as riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
import * as screeningToolsQuery from '../graphql/queries/get-screening-tools.graphql';
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
      tabId?: Tab;
      subTabId?: 'questions';
      questionId?: string;
      screeningToolId?: string;
      objectId?: string;
    };
  };
}

interface IStateProps {
  tabId: Tab;
  subTabId?: 'questions';
  objectId?: string;
  questionId?: string;
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
    const {
      objectId,
      questionId,
      riskAreas,
      screeningTools,
      subTabId,
      concerns,
      goals,
      refetchGoals,
      progressNoteTemplates,
      tabId,
    } = this.props;
    const questionsTabSelected = subTabId === 'questions';
    const concernsTabSelected = tabId === 'concerns';
    const goalsTabSelected = tabId === 'goals';
    const progressNoteTemplatesTabSelected =
      tabId === 'progress-note-templates' && subTabId !== 'questions';
    const toolsTabSelected = tabId === 'tools' && subTabId !== 'questions';
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
    const riskAreaId = tabId === 'domains' ? objectId : undefined;
    const screeningToolId = tabId === 'tools' ? objectId : undefined;
    const progressNoteTemplateId = tabId === 'progress-note-templates' ? objectId : undefined;

    const questions = questionsTabSelected ? (
      <BuilderQuestions
        riskAreas={riskAreas}
        riskAreaId={riskAreaId}
        screeningTools={screeningTools}
        screeningToolId={screeningToolId}
        progressNoteTemplateId={progressNoteTemplateId}
        progressNoteTemplates={progressNoteTemplates}
        routeBase={`/builder/${tabId}/${objectId}/questions`}
        questionId={questionId}
      />
    ) : null;
    const concernsHtml = concernsTabSelected ? (
      <BuilderConcerns routeBase={`/builder/concerns`} concerns={concerns} concernId={objectId} />
    ) : null;
    const goalsHtml = goalsTabSelected ? (
      <BuilderGoals
        routeBase={`/builder/goals`}
        goals={goals}
        goalId={objectId}
        refetchGoals={refetchGoals}
      />
    ) : null;
    const riskAreasHtml = riskAreasTabSelected ? (
      <BuilderRiskAreas
        routeBase={'/builder/domains'}
        riskAreas={riskAreas}
        riskAreaId={objectId}
      />
    ) : null;
    const toolsHtml = toolsTabSelected ? (
      <BuilderScreeningTools
        routeBase={'/builder/tools'}
        screeningTools={screeningTools}
        riskAreas={riskAreas}
        screeningToolId={objectId}
      />
    ) : null;
    const progressNoteTemplatesHtml = progressNoteTemplatesTabSelected ? (
      <BuilderProgressNoteTemplates
        routeBase={'/builder/progress-note-templates'}
        progressNoteTemplates={progressNoteTemplates}
        progressNoteTemplateId={objectId}
      />
    ) : null;
    const fallbackRiskAreaId = riskAreas && riskAreas[0] ? riskAreas[0].id : undefined;
    const selectedRiskAreaId = objectId ? objectId : fallbackRiskAreaId;
    return (
      <div className={styles.container}>
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <Link to={'/builder/domains'} className={riskAreaTabStyles}>
              Domains
            </Link>
            <Link
              to={`/builder/domains/${selectedRiskAreaId}/questions`}
              className={questionTabStyles}
            >
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
          {questions}
          {riskAreasHtml}
          {concernsHtml}
          {goalsHtml}
          {toolsHtml}
          {progressNoteTemplatesHtml}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    tabId: ownProps.match.params.tabId || 'domains',
    objectId: ownProps.match.params.objectId,
    questionId: ownProps.match.params.questionId,
    subTabId: ownProps.match.params.subTabId,
  };
}

export default compose(
  connect<IStateProps, {}, IProps>(mapStateToProps),
  graphql<IGraphqlProps, IProps>(progressNoteTemplatesQuery as any, {
    props: ({ data }) => ({
      progressNoteTemplatesLoading: data ? data.loading : false,
      progressNoteTemplatesError: data ? data.error : null,
      progressNoteTemplates: data ? (data as any).progressNoteTemplates : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(riskAreasQuery as any, {
    props: ({ data }) => ({
      riskAreasLoading: data ? data.loading : false,
      riskAreasError: data ? data.error : null,
      riskAreas: data ? (data as any).riskAreas : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(concernsQuery as any, {
    props: ({ data }) => ({
      concernsLoading: data ? data.loading : false,
      concernsError: data ? data.error : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(goalsQuery as any, {
    props: ({ data }) => ({
      refetchGoals: data ? data.refetch : null,
      goalsLoading: data ? data.loading : false,
      goalsError: data ? data.error : null,
      goals: data ? (data as any).goalSuggestionTemplates : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(screeningToolsQuery as any, {
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningTools : null,
    }),
  }),
)(BuilderContainer);
