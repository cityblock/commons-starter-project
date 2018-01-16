import * as classNames from 'classnames';
import { isAfter } from 'date-fns';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, LinkProps } from 'react-router-dom';
import { FullRiskAreaForPatientFragment } from '../../graphql/types';
import DateInfo from '../../shared/library/date-info/date-info';
import SmallText from '../../shared/library/small-text/small-text';
import TextInfo from '../../shared/library/text-info/text-info';
import * as styles from './css/domain-assessment.css';

interface IProps {
  routeBase: string | null;
  riskArea: FullRiskAreaForPatientFragment;
  suppressed: boolean;
  markAsSuppressed?: (riskAreaId: string) => void;
  assessmentDetailView?: boolean;
}

class DomainAssessment extends React.Component<IProps> {
  calculateSummaryStats() {
    const { riskArea, markAsSuppressed } = this.props;
    let lastUpdated = '';
    let totalScore: number | null = null;
    let forceHighRisk = false;
    const summaryText: string[] = [];

    riskArea.questions!.forEach(question => {
      question.answers!.forEach(answer => {
        if (answer.patientAnswers && answer.patientAnswers.length) {
          answer.patientAnswers.forEach(patientAnswer => {
            if (totalScore === null) totalScore = 0;

            if (!lastUpdated || isAfter(patientAnswer.updatedAt, lastUpdated)) {
              lastUpdated = patientAnswer.updatedAt;
            }

            if (answer.riskAdjustmentType === 'forceHighRisk') {
              forceHighRisk = true;
            } else if (answer.riskAdjustmentType === 'increment') {
              totalScore++;
            }

            if (
              answer.inSummary &&
              answer.summaryText &&
              !summaryText.includes(answer.summaryText)
            ) {
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
    if (
      markAsSuppressed &&
      riskArea.assessmentType === 'automated' &&
      !totalScore &&
      !forceHighRisk
    ) {
      markAsSuppressed(riskArea.id);
    }

    return { lastUpdated, totalScore, forceHighRisk, summaryText };
  }

  render(): JSX.Element | null {
    const { routeBase, riskArea, suppressed, assessmentDetailView } = this.props;
    if (suppressed) return null;

    const { lastUpdated, totalScore, forceHighRisk, summaryText } = this.calculateSummaryStats();
    const started =
      riskArea.riskAreaAssessmentSubmissions && riskArea.riskAreaAssessmentSubmissions.length
        ? riskArea.riskAreaAssessmentSubmissions[0].createdAt
        : null;

    const risk =
      totalScore !== null
        ? forceHighRisk || totalScore >= riskArea.highRiskThreshold
          ? 'high'
          : totalScore >= riskArea.mediumRiskThreshold ? 'medium' : 'low'
        : null;

    const containerStyles = classNames(styles.container, {
      [styles.greenBorder]: !assessmentDetailView && risk === 'low',
      [styles.yellowBorder]: !assessmentDetailView && risk === 'medium',
      [styles.redBorder]: !assessmentDetailView && risk === 'high',
      [styles.noLink]: !!assessmentDetailView,
    });
    const datesStyles = classNames(styles.dates, {
      [styles.alignEnd]: !assessmentDetailView,
    });
    const notCompleted = !totalScore && !forceHighRisk;

    let formattedSummaryText = null;
    if (!assessmentDetailView && notCompleted) {
      formattedSummaryText = (
        <FormattedMessage id="threeSixty.notCompleted">
          {(message: string) => <p className={styles.detail}>{message}</p>}
        </FormattedMessage>
      );
    } else if (!assessmentDetailView) {
      formattedSummaryText = <p className={styles.detail}>{summaryText.join(' | ')}</p>;
    }

    const dateText = notCompleted ? (
      <SmallText messageId="threeSixty.notCompletedShort" />
    ) : (
      <div className={datesStyles}>
        {riskArea.assessmentType === 'manual' &&
          (started ? (
            <DateInfo
              messageId="threeSixty.initialAssessment"
              date={started}
              className={styles.date}
            />
          ) : (
            <TextInfo
              messageId="threeSixty.initialAssessment"
              textMessageId="threeSixty.never"
              className={styles.date}
            />
          ))}
        <DateInfo label="updated" date={lastUpdated} />
      </div>
    );

    const linkProps: LinkProps = {
      to: `${routeBase}/assessment/${riskArea.id}`,
      className: styles.link,
    };
    // if already viewing assessment detail, do not do anything when clicking link
    if (!routeBase) {
      linkProps.onClick = (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault();
    }

    return (
      <div className={containerStyles}>
        <Link {...linkProps}>
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
