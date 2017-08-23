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
import AdminConcerns from './admin-concerns';
import AdminGoals from './admin-goals';
import AdminLeftNav from './admin-left-nav';
import AdminQuestions from './admin-questions';
import AdminRiskAreas from './admin-risk-areas';
import * as styles from './css/admin.css';

export interface IProps {
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

class AdminContainer extends React.Component<IProps, {}> {
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
      <AdminQuestions
        riskAreas={riskAreas}
        riskAreaId={objectId}
        routeBase={`/admin/domains/${objectId}/questions`}
        questionId={questionId} />
    ) : null;
    const concernsHtml = concernsTabSelected ? (
      <AdminConcerns routeBase={`/admin/concerns`} concerns={concerns} concernId={objectId} />
    ) : null;
    const goalsHtml = goalsTabSelected ? (
      <AdminGoals
        routeBase={`/admin/goals`}
        goals={goals}
        goalId={objectId}
        refetchGoals={refetchGoals} />
    ) : null;
    const riskAreasHtml = riskAreasTabSelected ? (
      <AdminRiskAreas routeBase={'/admin/domains'} riskAreas={riskAreas} riskAreaId={objectId} />
    ) : null;
    const fallbackRiskAreaId = riskAreas && riskAreas[0] ? riskAreas[0].id : undefined;
    const selectedRiskAreaId = objectId ? objectId : fallbackRiskAreaId;
    return (
      <div className={styles.container}>
        <AdminLeftNav />
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <Link to={`/admin/domains`} className={riskAreaTabStyles}>Domains</Link>
            <Link
              to={`/admin/domains/${selectedRiskAreaId}/questions`}
              className={questionTabStyles}>Questions</Link>
            <Link to={`/admin/concerns`} className={concernTabStyles}>Concerns</Link>
            <Link to={`/admin/goals`} className={goalTabStyles}>Goals</Link>
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
      riskAreasLoading: (data ? data.loading : false),
      riskAreasError: (data ? data.error : null),
      riskAreas: (data ? (data as any).riskAreas : null),
    }),
  }),
  graphql(concernsQuery as any, {
    props: ({ data }) => ({
      concernsLoading: (data ? data.loading : false),
      concernsError: (data ? data.error : null),
      concerns: (data ? (data as any).concerns : null),
    }),
  }),
  graphql(goalsQuery as any, {
    props: ({ data }) => ({
      refetchGoals: (data ? data.refetch : null),
      goalsLoading: (data ? data.loading : false),
      goalsError: (data ? data.error : null),
      goals: (data ? (data as any).goalSuggestionTemplates : null),
    }),
  }),
)(AdminContainer);
