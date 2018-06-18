import React from 'react';
import { FormattedMessage } from 'react-intl';
import { IScreeningToolResultSummary } from 'schema';
import styles from './css/domain-summary-bullets.css';
import { DomainSummaryBulletItems } from './domain-summary-bullet-items';

interface IProps {
  automatedSummaryText: string[];
  manualSummaryText: string[];
  screeningToolResultSummaries: IScreeningToolResultSummary[];
}

const DomainSummaryBullets: React.StatelessComponent<IProps> = (props: IProps) => {
  const { automatedSummaryText, manualSummaryText, screeningToolResultSummaries } = props;

  if (
    !automatedSummaryText.length &&
    !manualSummaryText.length &&
    !screeningToolResultSummaries.length
  ) {
    return (
      <FormattedMessage id="threeSixty.noAssessments">
        {(message: string) => <p className={styles.noAssessments}>{message}</p>}
      </FormattedMessage>
    );
  }
  // Only one assessment type if both are empty or lengths are unequal
  const bothEmpty = !automatedSummaryText.length && !manualSummaryText.length;
  const onlyOneAssessmentType =
    bothEmpty || !!automatedSummaryText.length !== !!manualSummaryText.length;

  if (onlyOneAssessmentType) {
    return (
      <div className={styles.container}>
        <DomainSummaryBulletItems
          items={automatedSummaryText.concat(manualSummaryText)}
          screeningToolResultSummaries={screeningToolResultSummaries}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FormattedMessage id="threeSixty.automated">
        {(message: string) => <h4>{message}</h4>}
      </FormattedMessage>
      <DomainSummaryBulletItems items={automatedSummaryText} />
      <FormattedMessage id="threeSixty.manual">
        {(message: string) => <h4>{message}</h4>}
      </FormattedMessage>
      <DomainSummaryBulletItems
        items={manualSummaryText}
        screeningToolResultSummaries={screeningToolResultSummaries}
      />
    </div>
  );
};

export default DomainSummaryBullets;
