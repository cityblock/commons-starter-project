import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
import { getRiskAreasQuery, FullRiskAreaFragment } from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from './css/risk-areas.css';
import RiskAreaSummary from './risk-area-summary';
import { RiskAreasLoadingError } from './risk-areas-loading-error';

interface IProps {
  patientId: string;
  routeBase: string;
}

interface IGraphqlProps {
  riskAreas?: getRiskAreasQuery['riskAreas'];
  loading?: boolean;
  error?: string;
}

class RiskAreas extends React.Component<IProps & IGraphqlProps, {}> {
  renderRiskAreaSummary = (riskArea: FullRiskAreaFragment, index: number) => {
    const { routeBase, patientId } = this.props;

    return (
      <RiskAreaSummary
        key={index}
        routeBase={routeBase}
        riskArea={riskArea}
        patientId={patientId}
      />
    );
  };

  renderRiskAreaSummaries() {
    const { loading, error, riskAreas } = this.props;

    const riskAreasToRender = riskAreas || [];

    if (riskAreasToRender.length) {
      return (
        <div className={styles.riskAreasList}>
          {riskAreasToRender.map(this.renderRiskAreaSummary)}
        </div>
      );
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyRiskAreasMessage}>
          <div className={styles.emptyRiskAreasLogo} />
          <div className={styles.emptyRiskAreasLabel}>No risk areas available</div>
          <div className={styles.emptyRiskAreasSubtext}>
            Risk areas will be shown here once they are created.
          </div>
        </div>
      );
    } else {
      return <RiskAreasLoadingError error={error} loading={loading} onRetryClick={() => true} />;
    }
  }

  render() {
    return (
      <div>
        <div className={sortSearchStyles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Sort by:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value="Newest first">
                <option value="Newest first">Newest first</option>
              </select>
            </div>
            <div className={classNames(sortSearchStyles.search, styles.marginLeft)}>
              <input required type="text" placeholder="Search by user or keywords" />
            </div>
          </div>
        </div>
        <div className={styles.riskAreasPanel}>
          <div className={styles.riskAreas}>{this.renderRiskAreaSummaries()}</div>
        </div>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps>(riskAreasQuery as any, {
  options: (props: IProps) => ({ variables: {} }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreas: data ? (data as any).riskAreas : null,
  }),
})(RiskAreas);
