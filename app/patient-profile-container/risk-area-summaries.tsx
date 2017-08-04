import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import * as riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
import { FullRiskAreaFragment } from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from './css/risk-areas.css';
import { RiskAreasLoadingError } from './risk-areas-loading-error';

export interface IProps {
  patientId: string;
  routeBase: string;
  riskAreas?: FullRiskAreaFragment[];
  loading?: boolean;
  error?: string;
}

class RiskAreas extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderRiskAreaSummary = this.renderRiskAreaSummary.bind(this);
    this.renderRiskAreaSummaries = this.renderRiskAreaSummaries.bind(this);
  }

  renderRiskAreaSummary(riskArea: FullRiskAreaFragment, index: number) {
    const { routeBase } = this.props;

    return (
      <Link key={index} to={`${routeBase}/${riskArea.id}`}>
        <div>{riskArea.title}</div>
      </Link>
    );
  }

  renderRiskAreaSummaries() {
    const { loading, error, riskAreas } = this.props;

    const riskAreasToRender = riskAreas || [];

    if (riskAreasToRender.length) {
      return riskAreasToRender.map(this.renderRiskAreaSummary);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyRiskAreasMessage}>
          <div className={styles.emptyRiskAreasLogo}></div>
          <div className={styles.emptyRiskAreasLabel}>No risk areas available</div>
          <div className={styles.emptyRiskAreasSubtext}>
            Risk areas will be shown here once they are created.
          </div>
        </div>
      );
    } else {
      return (
        <RiskAreasLoadingError
          error={error}
          loading={loading}
          onRetryClick={() => true}
        />
      );
    }

  }

  render() {
    const { riskAreas } = this.props;

    const riskAreasListStyles = classNames(styles.riskAreas, {
      [styles.emptyRiskAreasList]: (!riskAreas || !riskAreas.length),
    });

    return (
      <div>
        <div className={sortSearchStyles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Sort by:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value='Newest first'>
                <option value='Newest first'>Newest first</option>
              </select>
            </div>
            <div className={classNames(sortSearchStyles.search, styles.marginLeft)}>
              <input required type='text' placeholder='Search by user or keywords' />
            </div>
          </div>
        </div>
        <div className={styles.riskAreasPanel}>
          <div className={riskAreasListStyles}>{this.renderRiskAreaSummaries()}</div>
        </div>
      </div>
    );
  }
}

export default graphql(riskAreasQuery as any, {
  options: (props: IProps) => ({ variables: {} }),
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    riskAreas: (data ? (data as any).riskAreas : null),
  }),
})(RiskAreas);
