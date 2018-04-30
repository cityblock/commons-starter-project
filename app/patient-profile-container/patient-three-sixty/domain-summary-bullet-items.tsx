import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { IScreeningToolResultSummary } from 'schema';
import * as styles from './css/domain-summary-bullets.css';

interface IProps {
  items: string[];
  screeningToolResultSummaries?: IScreeningToolResultSummary[];
}

export const DomainSummaryBulletItems: React.StatelessComponent<IProps> = ({
  items,
  screeningToolResultSummaries,
}) => {
  const allListItems = (screeningToolResultSummaries || []).map(screeningToolResultSummary => {
    return (
      <DomainSummaryScreeningToolResultSummary
        key={screeningToolResultSummary.title}
        screeningToolResultSummary={screeningToolResultSummary}
      />
    );
  });

  const listItems = items.map((item, i) => {
    return (
      <li key={i}>
        <span>{item}</span>
      </li>
    );
  });

  return <ul>{allListItems.concat(listItems)}</ul>;
};

export const DomainSummaryScreeningToolResultSummary: React.StatelessComponent<{
  screeningToolResultSummary: IScreeningToolResultSummary;
}> = ({ screeningToolResultSummary }) => {
  const score =
    screeningToolResultSummary.score !== null ? screeningToolResultSummary.score : 'N/A';

  return (
    <li>
      <span>
        <FormattedMessage id="screeningTool.results">
          {(message: string) => (
            <span className={styles.bold}>{`${screeningToolResultSummary.title} ${message}`}</span>
          )}
        </FormattedMessage>
        {`${screeningToolResultSummary.description} - ${score}`}
      </span>
    </li>
  );
};
