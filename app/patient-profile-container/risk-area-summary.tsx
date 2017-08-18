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
  reloadScore?: (variables: { patientId: string, riskAreaId: string }) => any;
  riskAreaSummary?: FullRiskAreaSummaryFragment;
  summaryLoading?: boolean;
  summaryError?: string;
  reloadSummary?: (variables: { patientId: string, riskAreaId: string }) => any;
}

class RiskAreaSummary extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderSummaryText = this.renderSummaryText.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.isError = this.isError.bind(this);
    this.isLoadingOrError = this.isLoadingOrError.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRetryClick = this.onRetryClick.bind(this);
    this.reloadScore = this.reloadScore.bind(this);
    this.reloadSummary = this.reloadSummary.bind(this);
  }

  renderSummaryText() {
    const { riskAreaSummary } = this.props;
    let summaryListHtml: any = <div className={styles.emptySummary}>No summary available</div>;

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

    if (riskAreaSummary && !this.isLoading() && !this.isError()) {
      const { summary, started } = riskAreaSummary;

      if (!started) {
        summaryListHtml = <div className={styles.emptySummary}>No assessment on record.</div>;
      } else if (summary.length) {
        summaryListHtml = summary.map((summaryText, index) => <li key={index}>{summaryText}</li>);
      }

    } else if (this.isLoading()) {
      summaryListHtml = <div className={styles.emptySummary}>Loading...</div>;
    } else if (this.isError()) {
      summaryListHtml = (
        <div className={styles.errorLoadingSummary}>
          <div className={styles.summaryErrorLabel}>Error loading.</div>
          <div className={styles.summaryErrorRetry} onClick={this.onRetryClick}>
            <div className={styles.summaryErrorRetryText}>Try again.</div>
            <div className={styles.summaryErrorIcon}></div>
          </div>
        </div>
      );
    }

    return summaryListHtml;
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
    } else if (this.isError()) {
      return 'Error';
    } else {
      return 'Loading';
    }
  }

  isLoading() {
    const { scoreLoading, summaryLoading } = this.props;

    return scoreLoading || summaryLoading;
  }

  isError() {
    const { scoreError, summaryError } = this.props;

    return !!scoreError || !!summaryError;
  }

  isLoadingOrError() {
    return this.isLoading() || this.isError();
  }

  async reloadScore() {
    const { scoreError, reloadScore, patientId, riskArea } = this.props;

    if (!!scoreError && reloadScore) {
      this.setState(() => ({ scoreLoading: true, scoreError: undefined }));

      try {
        await reloadScore({ patientId, riskAreaId: riskArea.id });
        this.setState(() => ({ scoreLoading: false, scoreError: undefined }));
      } catch (err) {
        this.setState(() => ({ scoreLoading: false, scoreError: err.message }));
      }
    }
  }

  async reloadSummary() {
    const { summaryError, reloadSummary, patientId, riskArea } = this.props;

    if (!!summaryError && reloadSummary) {
      this.setState(() => ({ summaryLoading: true, summaryError: undefined }));

      try {
        await reloadSummary({ patientId, riskAreaId: riskArea.id });
        this.setState(() => ({ summaryLoading: false, summaryError: undefined }));
      } catch (err) {
        this.setState(() => ({ summaryLoading: false, summaryError: err.message }));
      }
    }
  }

  onRetryClick() {
    this.reloadScore();
    this.reloadSummary();
  }

  onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (this.isLoadingOrError()) {
      event.preventDefault();
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

    const linkStyles = classNames(styles.riskAreaLink, {
      [styles.inactive]: this.isLoadingOrError(),
    });

    return (
      <Link
        className={linkStyles}
        to={`${routeBase}/${riskArea.id}`}
        onClick={this.onClick}>
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
      reloadSummary: (data ? (data as any).refetch : null),
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
      reloadScore: (data ? (data as any).refetch : null),
    }),
  }),
)(RiskAreaSummary);
