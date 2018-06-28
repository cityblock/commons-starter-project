import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, LinkProps } from 'react-router-dom';
import { FullRiskAreaForPatient } from '../../graphql/types';
import DateInfo from '../../shared/library/date-info/date-info';
import TextInfo from '../../shared/library/text-info/text-info';
import Text from '../../shared/library/text/text';
import styles from './css/domain-assessment.css';

interface IProps {
  routeBase: string | null;
  riskArea: FullRiskAreaForPatient;
  suppressed: boolean;
  markAsSuppressed?: (riskAreaId: string) => void;
  assessmentDetailView?: boolean;
}

export const DomainAssessment: React.StatelessComponent<IProps> = (props: IProps) => {
  const { routeBase, riskArea, suppressed, assessmentDetailView } = props;

  if (suppressed) return null;

  const started =
    riskArea.riskAreaAssessmentSubmissions && riskArea.riskAreaAssessmentSubmissions.length
      ? riskArea.riskAreaAssessmentSubmissions[0].createdAt
      : null;

  const containerStyles = classNames(styles.container, {
    [styles.greenBorder]: !assessmentDetailView && riskArea.riskScore === 'low',
    [styles.yellowBorder]: !assessmentDetailView && riskArea.riskScore === 'medium',
    [styles.redBorder]: !assessmentDetailView && riskArea.riskScore === 'high',
    [styles.noLink]: !!assessmentDetailView,
  });
  const datesStyles = classNames(styles.dates, {
    [styles.alignEnd]: !assessmentDetailView,
  });
  const notCompleted = !riskArea.lastUpdated;

  let formattedSummaryText = null;
  if (!assessmentDetailView && notCompleted) {
    formattedSummaryText = (
      <FormattedMessage id="threeSixty.notCompleted">
        {(message: string) => <p className={styles.detail}>{message}</p>}
      </FormattedMessage>
    );
  } else if (!assessmentDetailView) {
    formattedSummaryText = <p className={styles.detail}>{riskArea.summaryText.join(' | ')}</p>;
  }

  const dateText = notCompleted ? (
    <Text messageId="threeSixty.notCompletedShort" />
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
      <DateInfo label="updated" date={riskArea.lastUpdated} />
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
};
