import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullRiskAreaFragment } from '../graphql/types';
import * as riskAreasStyles from '../shared/css/two-panel.css';
import * as styles from './css/risk-area-row.css';

interface IProps {
  riskArea: FullRiskAreaFragment;
  selected: boolean;
  routeBase: string;
}

export const RiskAreaRow: React.StatelessComponent<IProps> = props => {
  const { riskArea, selected, routeBase } = props;
  const riskAreaClass = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = riskArea.createdAt ? (
    <FormattedRelative value={riskArea.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  return (
    <Link className={riskAreaClass} to={`${routeBase}/${riskArea.id}`}>
      <div className={styles.title}>{riskArea.title}</div>
      <div className={styles.meta}>
        <div className={classNames(riskAreasStyles.dateSection, riskAreasStyles.orderSection)}>
          <span className={styles.dateLabel}>Order:</span>
          <span className={styles.dateValue}>{riskArea.order}</span>
        </div>
        <div className={classNames(riskAreasStyles.dateSection, riskAreasStyles.createdAtSection)}>
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};
