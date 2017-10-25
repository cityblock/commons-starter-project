import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullScreeningToolFragment } from '../graphql/types';
import * as screeningToolStyles from '../shared/css/two-panel.css';
import * as styles from './css/risk-area-row.css';

export interface IProps {
  screeningTool: FullScreeningToolFragment;
  selected: boolean;
  routeBase: string;
}

export const ScreeningToolRow: React.StatelessComponent<IProps> = props => {
  const { screeningTool, selected, routeBase } = props;
  const screeningToolClass = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = screeningTool.createdAt ? (
    <FormattedRelative value={screeningTool.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  return (
    <Link className={screeningToolClass} to={`${routeBase}/${screeningTool.id}`}>
      <div className={styles.title}>{screeningTool.title}</div>
      <div className={styles.meta}>
        <div
          className={classNames(screeningToolStyles.dateSection, screeningToolStyles.orderSection)}
        >
          <span className={styles.dateLabel}>Risk Area:</span>
          <span className={styles.dateValue}>{screeningTool.riskArea.title}</span>
        </div>
        <div
          className={classNames(
            screeningToolStyles.dateSection,
            screeningToolStyles.createdAtSection,
          )}
        >
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};
