import classNames from 'classnames';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullRiskAreaGroupFragment } from '../../graphql/types';
import sharedStyles from '../../shared/css/two-panel.css';
import styles from '../css/risk-area-row.css';

interface IProps {
  riskAreaGroup: FullRiskAreaGroupFragment;
  routeBase: string;
  selected: boolean;
}

const RiskAreaGroup: React.StatelessComponent<IProps> = (props: IProps) => {
  const { riskAreaGroup, routeBase, selected } = props;
  const containerStyles = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = riskAreaGroup.createdAt ? (
    <FormattedRelative value={riskAreaGroup.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;

  return (
    <Link className={containerStyles} to={`${routeBase}/${riskAreaGroup.id}`}>
      <div className={styles.title}>{riskAreaGroup.title}</div>
      <div className={styles.meta}>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.orderSection)}>
          <span className={styles.dateLabel}>Order:</span>
          <span className={styles.dateValue}>{riskAreaGroup.order}</span>
        </div>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.orderSection)}>
          <span className={styles.dateLabel}>Medium Risk Threshold:</span>
          <span className={styles.dateValue}>{riskAreaGroup.mediumRiskThreshold}</span>
        </div>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.orderSection)}>
          <span className={styles.dateLabel}>High Risk Threshold:</span>
          <span className={styles.dateValue}>{riskAreaGroup.highRiskThreshold}</span>
        </div>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.createdAtSection)}>
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};

export default RiskAreaGroup;
