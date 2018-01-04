import * as classNames from 'classnames';
import { isAfter } from 'date-fns';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullRiskAreaForPatientFragment } from '../../graphql/types';
import DateInfo from '../../shared/library/date-info/date-info';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/domain-assessment.css';

interface IProps {
  routeBase: string;
  riskArea: FullRiskAreaForPatientFragment;
  suppressed: boolean;
  markAsSuppressed: (riskAreaId: string) => void;
}

interface IState {
  started: string;
  lastUpdated: string;
  totalScore: number | null;
  forceHighRisk: boolean;
  summaryText: string[];
  calculated: boolean;
}

class DomainAssessment extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      started: '',
      lastUpdated: '',
      totalScore: null,
      forceHighRisk: false,
      summaryText: [],
      calculated: false,
    };
  }

  componentDidMount(): void {
    if (!this.state.calculated) {
      this.calculateSummaryStats();
    }
  }

  calculateSummaryStats(): void {
    const { riskArea, markAsSuppressed } = this.props;
    let { started, lastUpdated, totalScore, forceHighRisk } = this.state;
    const { summaryText } = this.state;

    riskArea.questions!.forEach(question => {
      question.answers!.forEach(answer => {
        if (answer.patientAnswers && answer.patientAnswers.length) {
          answer.patientAnswers.forEach(patientAnswer => {
            if (totalScore === null) totalScore = 0;

            if (!started || isAfter(started, patientAnswer.createdAt)) {
              started = patientAnswer.createdAt;
            }
            if (!lastUpdated || isAfter(patientAnswer.updatedAt, lastUpdated)) {
              lastUpdated = patientAnswer.updatedAt;
            }

            if (answer.riskAdjustmentType === 'forceHighRisk') {
              forceHighRisk = true;
            } else if (answer.riskAdjustmentType === 'increment') {
              totalScore++;
            }

            if (answer.inSummary && answer.summaryText) {
              summaryText.push(answer.summaryText);
            }
          });
        }
      });
    });
    riskArea.screeningTools.forEach(screeningTool => {
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

    // do not show this card if automated with zero or null risk score
    if (riskArea.assessmentType === 'automated' && !totalScore && !forceHighRisk) {
      markAsSuppressed(riskArea.id);
    }

    this.setState({
      started,
      lastUpdated,
      totalScore,
      forceHighRisk,
      summaryText,
      calculated: true,
    });
  }

  render(): JSX.Element | null {
    const { routeBase, riskArea, suppressed } = this.props;
    if (suppressed) return null;

    const { started, lastUpdated, totalScore, forceHighRisk, summaryText } = this.state;

    const risk =
      totalScore !== null
        ? forceHighRisk || totalScore >= riskArea.highRiskThreshold
          ? 'high'
          : totalScore >= riskArea.mediumRiskThreshold ? 'medium' : 'low'
        : null;

    const containerStyles = classNames(styles.container, {
      [styles.greenBorder]: risk === 'low',
      [styles.yellowBorder]: risk === 'medium',
      [styles.redBorder]: risk === 'high',
    });
    const notCompleted = !totalScore && !forceHighRisk;

    const formattedSummaryText = notCompleted ? (
      <FormattedMessage id="threeSixty.notCompleted">
        {(message: string) => <p className={styles.detail}>{message}</p>}
      </FormattedMessage>
    ) : (
      <p className={styles.detail}>{summaryText.join(' | ')}</p>
    );

    const dateText = notCompleted ? (
      <SmallText messageId="threeSixty.notCompletedShort" />
    ) : (
      <div className={styles.dates}>
        {riskArea.assessmentType === 'manual' && (
          <DateInfo messageId="threeSixty.initialAssessment" date={started} />
        )}
        <DateInfo label="updated" date={lastUpdated} className={styles.date} />
      </div>
    );

    return (
      <div className={containerStyles}>
        <Link to={`${routeBase}/assessment/${riskArea.id}`} className={styles.link}>
          <h2>{riskArea.title}</h2>
          <div className={styles.flex}>
            {formattedSummaryText}
            {dateText}
          </div>
        </Link>
      </div>
    );
  }
}

export default DomainAssessment;
