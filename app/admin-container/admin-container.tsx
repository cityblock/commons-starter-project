import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
import { FullRiskAreaFragment } from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import { IState as IAppState } from '../store';
import AdminLeftNav from './admin-left-nav';
import AdminQuestions from './admin-questions';
import AdminRiskAreas from './admin-risk-areas';
import * as styles from './css/admin.css';

export interface IProps {
  riskAreas: FullRiskAreaFragment[];
  tabId: 'domains';
  subTabId?: 'questions';
  riskAreaId?: string;
  questionId?: string;
  loading: boolean;
  error?: string;
  match: {
    params: {
      tabId?: 'domains';
      subTabId?: 'questions';
      questionId?: string;
      riskAreaId?: string;
    };
  };
}

class AdminContainer extends React.Component<IProps, {}> {

  render() {
    const { riskAreaId, questionId, riskAreas, subTabId } = this.props;
    const questionsTabSelected = subTabId === 'questions';
    const riskAreaTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: !questionsTabSelected,
    });
    const questionTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: questionsTabSelected,
    });

    const questions = questionsTabSelected ? (
      <AdminQuestions
        riskAreas={riskAreas}
        riskAreaId={riskAreaId}
        routeBase={`/admin/domains/${riskAreaId}/questions`}
        questionId={questionId} />
    ) : null;
    const riskAreasHtml = !questionsTabSelected ? (
      <AdminRiskAreas routeBase={'/admin/domains'} riskAreas={riskAreas} riskAreaId={riskAreaId} />
    ) : null;
    const fallbackRiskAreaId = riskAreas && riskAreas[0] ? riskAreas[0].id : undefined;
    const selectedRiskAreaId = riskAreaId ? riskAreaId : fallbackRiskAreaId;
    return (
      <div className={styles.container}>
        <AdminLeftNav />
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <Link to={`/admin/domains`} className={riskAreaTabStyles}>Domains</Link>
            <Link
              to={`/admin/domains/${selectedRiskAreaId}/questions`}
              className={questionTabStyles}>Questions</Link>
          </div>
          {questions}
          {riskAreasHtml}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    tabId: ownProps.match.params.tabId || 'domains',
    riskAreaId: ownProps.match.params.riskAreaId,
    questionId: ownProps.match.params.questionId,
    subTabId: ownProps.match.params.subTabId,
  };
}

export default compose(
  connect(mapStateToProps),
  graphql(riskAreasQuery as any, {
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      riskAreas: (data ? (data as any).riskAreas : null),
    }),
  }),
)(AdminContainer);
