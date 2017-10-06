import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as concernsQuery from '../graphql/queries/get-concerns.graphql';
import * as goalsQuery from '../graphql/queries/get-goal-suggestion-templates.graphql';
import * as riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
import {
  FullConcernFragment,
  FullGoalSuggestionTemplateFragment,
  FullRiskAreaFragment,
} from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import { IState as IAppState } from '../store';
import BuilderConcerns from './builder-concerns';
import BuilderGoals from './builder-goals';
import BuilderLeftNav from './builder-left-nav';
import BuilderQuestions from './builder-questions';
import BuilderRiskAreas from './builder-risk-areas';
import * as styles from './css/builder.css';

interface IProps {
  riskAreas: FullRiskAreaFragment[];
  concerns: FullConcernFragment[];
  goals: FullGoalSuggestionTemplateFragment[];
  tabId: 'domains' | 'concerns' | 'goals';
  subTabId?: 'questions';
  objectId?: string;
  questionId?: string;
  riskAreasLoading: boolean;
  riskAreasError?: string;
  concernsLoading: boolean;
  concernsError?: string;
  goalsLoading: boolean;
  goalsError?: string;
  mutate: any;
  refetchGoals: () => any;
  match: {
    params: {
      tabId?: 'domains' | 'concerns' | 'goals';
      subTabId?: 'questions';
      questionId?: string;
      objectId?: string;
    };
  };
}

class BuilderContainer extends React.Component<IProps, {}> {
  render() {
    const {
      objectId,
      questionId,
      riskAreas,
      subTabId,
      concerns,
      goals,
      refetchGoals,
      tabId,
    } = this.props;
    const questionsTabSelected = subTabId === 'questions';
    const concernsTabSelected = tabId === 'concerns';
    const goalsTabSelected = tabId === 'goals';
    const riskAreasTabSelected = !questionsTabSelected && !concernsTabSelected && !goalsTabSelected;
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

    const questions = questionsTabSelected ? (
      <BuilderQuestions
        riskAreas={riskAreas}
        riskAreaId={objectId}
        routeBase={`/builder/domains/${objectId}/questions`}
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
    const fallbackRiskAreaId = riskAreas && riskAreas[0] ? riskAreas[0].id : undefined;
    const selectedRiskAreaId = objectId ? objectId : fallbackRiskAreaId;
    return (
      <div className={styles.container}>
        <BuilderLeftNav />
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <Link to={`/builder/domains`} className={riskAreaTabStyles}>
              Domains
            </Link>
            <Link
              to={`/builder/domains/${selectedRiskAreaId}/questions`}
              className={questionTabStyles}
            >
              Questions
            </Link>
            <Link to={`/builder/concerns`} className={concernTabStyles}>
              Concerns
            </Link>
            <Link to={`/builder/goals`} className={goalTabStyles}>
              Goals
            </Link>
          </div>
          {questions}
          {riskAreasHtml}
          {concernsHtml}
          {goalsHtml}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    tabId: ownProps.match.params.tabId || 'domains',
    objectId: ownProps.match.params.objectId,
    questionId: ownProps.match.params.questionId,
    subTabId: ownProps.match.params.subTabId,
  };
}

export default compose(
  connect(mapStateToProps),
  graphql(riskAreasQuery as any, {
    props: ({ data }) => ({
      riskAreasLoading: data ? data.loading : false,
      riskAreasError: data ? data.error : null,
      riskAreas: data ? (data as any).riskAreas : null,
    }),
  }),
  graphql(concernsQuery as any, {
    props: ({ data }) => ({
      concernsLoading: data ? data.loading : false,
      concernsError: data ? data.error : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql(goalsQuery as any, {
    props: ({ data }) => ({
      refetchGoals: data ? data.refetch : null,
      goalsLoading: data ? data.loading : false,
      goalsError: data ? data.error : null,
      goals: data ? (data as any).goalSuggestionTemplates : null,
    }),
  }),
)(BuilderContainer);
