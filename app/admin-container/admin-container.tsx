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

type SelectableTabs = 'domains' | 'questions';

export interface IProps {
  riskAreas: FullRiskAreaFragment[];
  tabId: SelectableTabs;
  itemId?: string;
  loading: boolean;
  error?: string;
  match: {
    params: {
      itemId?: string;
      tabId?: SelectableTabs;
    };
  };
}

class AdminContainer extends React.Component<IProps, {}> {

  render() {
    const { itemId, tabId, riskAreas } = this.props;
    const riskAreaTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'domains',
    });
    const questionTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: tabId === 'questions',
    });

    const questions = tabId === 'questions' ? <AdminQuestions /> : null;
    const riskAreasHtml = tabId === 'domains' ? (
      <AdminRiskAreas routeBase={'/admin/domains'} riskAreas={riskAreas} riskAreaId={itemId} />
    ) : null;

    return (
      <div className={styles.container}>
        <AdminLeftNav />
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <Link to={`/admin/domains`} className={riskAreaTabStyles}>Domains</Link>
            <Link to={`/admin/questions`} className={questionTabStyles}>Quesitons</Link>
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
    itemId: ownProps.match.params.itemId,
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
