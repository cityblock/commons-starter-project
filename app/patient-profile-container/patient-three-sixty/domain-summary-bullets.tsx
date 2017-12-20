import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/domain-summary-bullets.css';

interface IProps {
  automatedSummaryText: string[];
  manualSummaryText: string[];
}

export const DomainSummaryBulletItems: React.StatelessComponent<{ items: string[] }> = ({
  items,
}) => {
  const listItems = items.map((item, i) => {
    return (
      <li key={i}>
        <span>{item}</span>
      </li>
    );
  });

  return <ul>{listItems}</ul>;
};

const DomainSummaryBullets: React.StatelessComponent<IProps> = (props: IProps) => {
  const { automatedSummaryText, manualSummaryText } = props;

  if (!automatedSummaryText.length && !manualSummaryText.length) {
    return (
      <FormattedMessage id="threeSixty.noAssessments">
        {(message: string) => <p className={styles.noAssessments}>{message}</p>}
      </FormattedMessage>
    );
  }

  const onlyOneAssessmentType = !!automatedSummaryText.length !== !!manualSummaryText.length;
  if (onlyOneAssessmentType) {
    return (
      <div className={styles.container}>
        <DomainSummaryBulletItems items={automatedSummaryText.concat(manualSummaryText)} />
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
      <DomainSummaryBulletItems items={manualSummaryText} />
    </div>
  );
};

export default DomainSummaryBullets;
