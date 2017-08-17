import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { DATETIME_FORMAT } from '../config';
import * as riskScoreQuery from '../graphql/queries/get-patient-risk-score-for-risk-area.graphql';
/* tslint:disable:max-line-length */
import * as riskSummaryQuery from '../graphql/queries/get-patient-risk-summary-for-risk-area.graphql';
/* tslint:enable:max-line-length */
import {
  FullRiskAreaFragment,
  FullRiskAreaSummaryFragment,
  FullRiskScoreFragment,
} from '../graphql/types';
import * as styles from './css/risk-areas.css';

export interface IProps {
  patientId: string;
  routeBase: string;
  riskArea: FullRiskAreaFragment;
  riskAreaScore?: FullRiskScoreFragment;
  scoreLoading?: boolean;
  scoreError?: string;
  riskAreaSummary?: FullRiskAreaSummaryFragment;
  summaryLoading?: boolean;
  summaryError?: string;
}

class RiskAreaSummary extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderSummaryText = this.renderSummaryText.bind(this);
  }

  renderSummaryText() {
    const { riskAreaSummary } = this.props;

    /* For future reference, once we need to do nested lists, here is the structure:
     *
     * <li>
     *   Patient does not have a housing case manager
     *   <ul className={styles.subSummaryList}>
     *     <li>Diabets Type 2 - E11.0</li>
     *     <li>Systolic (congestive) heart failure - I50.2</li>
     *   </ul>
     * </li>
     *
     */

    if (riskAreaSummary) {
      const { summary, started } = riskAreaSummary;

      let summaryListHtml: any = <li>No summary available</li>;

      if (!started) {
        summaryListHtml = <li>Patient has not started this assessment</li>;
      } else if (summary.length) {
        summaryListHtml = summary.map((summaryText, index) => <li key={index}>{summaryText}</li>);
      }

      return (
        <ul className={styles.riskAreaSummaryList}>
          {summaryListHtml}
        </ul>
      );
    }
  }

  getLastUpdated() {
    const { riskAreaSummary } = this.props;

    if (riskAreaSummary) {
      const { lastUpdated, started } = riskAreaSummary;

      if (started && lastUpdated) {
        return moment(lastUpdated, DATETIME_FORMAT).format('MMM D, YYYY');
      } else {
        return 'Never';
      }
    } else {
      return 'Loading';
    }
  }

  render() {
    const { riskArea, routeBase, riskAreaScore, riskAreaSummary } = this.props;

    // TODO: when to trigger high/medium risk based on actual score?
    const riskAreaStyles = classNames(styles.riskArea, {
      [styles.highRisk]: riskAreaScore ? !!riskAreaScore.forceHighRisk : false,
      [styles.mediumRisk]: false,
      [styles.unstarted]: riskAreaSummary ? !riskAreaSummary.started : true,
    });

    return (
      <Link className={styles.riskAreaLink} to={`${routeBase}/${riskArea.id}`}>
        <div className={riskAreaStyles}>
          <div className={styles.riskAreaTitleRow}>
            <div className={styles.riskAreaTitle}>
              <div className={styles.titleIcon}></div>
              <div className={styles.titleText}>{riskArea.title}</div>
            </div>
            <div className={styles.riskAreaLastUpdated}>
              <div className={styles.lastUpdatedLabel}>Updated:</div>
              <div className={styles.lastUpdatedValue}>{this.getLastUpdated()}</div>
            </div>
          </div>
          <div className={styles.riskAreaBody}>
            {this.renderSummaryText()}
          </div>
        </div>
      </Link>
    );
  }
}

export default compose(
  graphql(riskSummaryQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
        riskAreaId: props.riskArea.id,
      },
    }),
    props: ({ data }) => ({
      summaryLoading: (data ? data.loading : false),
      summaryError: (data ? data.error : null),
      riskAreaSummary: (data ? (data as any).patientRiskAreaSummary : null),
    }),
  }),
  graphql(riskScoreQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
        riskAreaId: props.riskArea.id,
      },
    }),
    props: ({ data }) => ({
      scoreLoading: (data ? data.loading : false),
      scoreError: (data ? data.error : null),
      riskAreaScore: (data ? (data as any).patientRiskAreaRiskScore : null),
    }),
  }),
)(RiskAreaSummary);
