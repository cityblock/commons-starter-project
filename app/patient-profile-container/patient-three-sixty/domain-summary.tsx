import * as classNames from 'classnames';
import { isAfter } from 'date-fns';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import * as getRiskAreaGroupForPatientGraphql from '../../graphql/queries/get-risk-area-group-for-patient.graphql';
import { getRiskAreaGroupForPatientQuery } from '../../graphql/types';
import DateInfo from '../../shared/library/date-info/date-info';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/domain-summary.css';
import DomainSummaryBullets from './domain-summary-bullets';
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
    const automatedSummaryText: string[] = [];
    const manualSummaryText: string[] = [];
    let lastUpdated = '';

    if (!riskAreaGroup || !riskAreaGroup.riskAreas) return;

    riskAreaGroup.riskAreas.forEach(area => {
      area.questions!.forEach(question => {
        question.answers!.forEach(answer => {
          if (answer.patientAnswers && answer.patientAnswers.length) {
            answer.patientAnswers.forEach(patientAnswer => {
              if (totalScore === null) totalScore = 0;

              const updatedAt = patientAnswer.updatedAt;
              if (!lastUpdated || isAfter(updatedAt, lastUpdated)) {
                lastUpdated = updatedAt;
              }

              if (answer.riskAdjustmentType === 'forceHighRisk') {
                forceHighRisk = true;
              } else if (answer.riskAdjustmentType === 'increment') {
                totalScore++;
              }

              if (answer.inSummary && answer.summaryText && area.assessmentType === 'automated') {
                automatedSummaryText.push(answer.summaryText);
              } else if (
                answer.inSummary &&
                answer.summaryText &&
                area.assessmentType === 'manual'
              ) {
                manualSummaryText.push(answer.summaryText);
              }
            });
          }
        });
      });
      area.screeningTools.forEach(screeningTool => {
        screeningTool.patientScreeningToolSubmissions.forEach(submission => {
          const { screeningToolScoreRange } = submission;

          if (screeningToolScoreRange) {
            const { riskAdjustmentType } = screeningToolScoreRange;

            if (riskAdjustmentType === 'forceHighRisk') {
              forceHighRisk = true;
            } else if (riskAdjustmentType === 'increment') {
              if (totalScore === null) totalScore = 0;
              totalScore++;
            }
          }
        });
      });
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
      ? `${routeBase}/${riskAreaGroupId}/assessment/${riskAreaGroup.riskAreas![0].id}`
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
    const { riskAreaGroupId, patientId } = props;
    return { variables: { riskAreaGroupId, patientId } };
  },
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaGroup: data ? (data as any).riskAreaGroupForPatient : null,
  }),
})(DomainSummary);
