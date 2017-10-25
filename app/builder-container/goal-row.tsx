import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullGoalSuggestionTemplateFragment } from '../graphql/types';
import * as concernStyles from '../shared/css/two-panel.css';
import * as styles from './css/risk-area-row.css';

interface IProps {
  goal: FullGoalSuggestionTemplateFragment;
  selected: boolean;
  routeBase: string;
}

export const GoalRow: React.StatelessComponent<IProps> = props => {
  const { goal, selected, routeBase } = props;
  const goalClass = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = goal.createdAt ? (
    <FormattedRelative value={goal.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  return (
    <Link className={goalClass} to={`${routeBase}/${goal.id}`}>
      <div className={styles.title}>{goal.title}</div>
      <div className={styles.meta}>
        <div className={classNames(concernStyles.dateSection, concernStyles.createdAtSection)}>
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};
