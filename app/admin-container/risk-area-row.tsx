import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullRiskAreaFragment } from '../graphql/types';
import * as styles from './css/risk-area-row.css';
import * as riskAreasStyles from './css/two-panel-admin.css';

export interface IProps {
  riskArea: FullRiskAreaFragment;
  selected: boolean;
  routeBase: string;
}

export const RiskAreaRow: React.StatelessComponent<IProps> = props => {
  const { riskArea, selected, routeBase } = props;
  const riskAreaClass = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = riskArea.createdAt ?
    (<FormattedRelative value={riskArea.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>) : null;
  return (
    <Link className={riskAreaClass} to={`${routeBase}/${riskArea.id}`}>
      <div className={styles.title}>{riskArea.title}</div>
      <div className={styles.meta}>
        <div className={classNames(riskAreasStyles.dateSection, riskAreasStyles.openedAt)}>
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};
