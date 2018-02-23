import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import * as getRiskAreaGroupForPatientGraphql from '../../graphql/queries/get-risk-area-group-for-patient.graphql';
import { getRiskAreaGroupForPatientQuery } from '../../graphql/types';
import DateInfo from '../../shared/library/date-info/date-info';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/domain-summary.css';
import DomainSummaryBullets from './domain-summary-bullets';
import { calculateRiskAreaSummaryStats } from './helpers';
import { IRiskAreaGroupScore } from './patient-three-sixty-domains';

type Risk = 'low' | 'medium' | 'high' | null;
type RiskAreaGroup = getRiskAreaGroupForPatientQuery['riskAreaGroupForPatient'];

interface IProps {
  routeBase: string;
  patientId: string;
  riskAreaGroupId: string;
  risk: Risk;
  updateRiskAreaGroupScore: (
    riskAreaGroupId: string,
    riskAreaGroupScore: IRiskAreaGroupScore,
  ) => void;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  riskAreaGroup: RiskAreaGroup;
}

type allProps = IGraphqlProps & IProps;

interface IState {
  automatedSummaryText: string[];
  manualSummaryText: string[];
  lastUpdated: string | null;
}

export class DomainSummary extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      automatedSummaryText: [],
      manualSummaryText: [],
      lastUpdated: null,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    // once our risk area group is loaded, calculate associated risk scores
    if (
      (!this.props.riskAreaGroup && nextProps.riskAreaGroup) ||
      (nextProps.riskAreaGroup &&
        !this.state.automatedSummaryText.length &&
        !this.state.manualSummaryText.length)
    ) {
      this.updateRiskAreaGroupScore(nextProps.riskAreaGroup);
    }
  }

  updateRiskAreaGroupScore(riskAreaGroup: RiskAreaGroup): void {
    const { updateRiskAreaGroupScore } = this.props;
    let totalScore: number | null = null;
    let forceHighRisk = false;
    let automatedSummaryText: string[] = [];
    let manualSummaryText: string[] = [];
    let lastUpdated = '';

    if (!riskAreaGroup || !riskAreaGroup.riskAreas) return;

    riskAreaGroup.riskAreas.forEach(riskArea => {
      const isAutomated = riskArea.assessmentType === 'automated';
      const summaryText = isAutomated ? automatedSummaryText : manualSummaryText;
      const riskAreaSummaryStats = calculateRiskAreaSummaryStats(riskArea, {
        lastUpdated,
        totalScore,
        forceHighRisk,
        summaryText,
      });

      totalScore = riskAreaSummaryStats.totalScore;
      forceHighRisk = riskAreaSummaryStats.forceHighRisk;
      lastUpdated = riskAreaSummaryStats.lastUpdated;

      if (isAutomated) {
        automatedSummaryText = riskAreaSummaryStats.summaryText;
      } else {
        manualSummaryText = riskAreaSummaryStats.summaryText;
      }
    });

    updateRiskAreaGroupScore(riskAreaGroup.id, { totalScore, forceHighRisk });
    this.setState({ automatedSummaryText, manualSummaryText, lastUpdated });
  }

  render(): JSX.Element | null {
    const { routeBase, riskAreaGroupId, riskAreaGroup, risk, loading } = this.props;
    if (loading || !riskAreaGroup) return null;
    const domainStyles = classNames(styles.domain, {
      [styles.redBorder]: risk && risk === 'high',
      [styles.yellowBorder]: risk && risk === 'medium',
      [styles.greenBorder]: risk && risk === 'low',
    });
    const { lastUpdated, automatedSummaryText, manualSummaryText } = this.state;
    const noAutomated =
      !!riskAreaGroup.riskAreas &&
      !!riskAreaGroup.riskAreas.length &&
      !riskAreaGroup.riskAreas.some(area => {
        return area.assessmentType === 'automated';
      });
    // if no automated assessments, link directly to manual assessment (1 per domain)
    const href = noAutomated
      ? `${routeBase}/${riskAreaGroupId}/assessment/${riskAreaGroup.riskAreas[0].id}`
      : `${routeBase}/${riskAreaGroupId}`;

    return (
      <Link to={href} className={domainStyles}>
        <div className={classNames(styles.flex, styles.header)}>
          <div className={styles.flex}>
            <Icon name="home" className={styles.icon} />
            <h3>{riskAreaGroup.title}</h3>
          </div>
          {lastUpdated && <DateInfo label="updated" date={lastUpdated} />}
        </div>
        <DomainSummaryBullets
          automatedSummaryText={automatedSummaryText}
          manualSummaryText={manualSummaryText}
        />
      </Link>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(getRiskAreaGroupForPatientGraphql as any, {
  options: (props: IProps) => {
    const { riskAreaGroupId, patientId, glassBreakId } = props;
    return { variables: { riskAreaGroupId, patientId, glassBreakId }, fetchPolicy: 'network-only' };
  },
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaGroup: data ? (data as any).riskAreaGroupForPatient : null,
  }),
})(DomainSummary);
