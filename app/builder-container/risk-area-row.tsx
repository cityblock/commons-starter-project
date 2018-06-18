import classNames from 'classnames';
import React from 'react';
import { graphql } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import riskAreaGroupShortQueryGraphql from '../graphql/queries/get-risk-area-group-short.graphql';
import { getRiskAreaGroupShortQuery, FullRiskAreaFragment } from '../graphql/types';
import riskAreasStyles from '../shared/css/two-panel.css';
import styles from './css/risk-area-row.css';

interface IProps {
  riskArea: FullRiskAreaFragment;
  selected: boolean;
  routeBase: string;
}

interface IGraphqlProps {
  riskAreaGroup: getRiskAreaGroupShortQuery['riskAreaGroup'];
}

type allProps = IProps & IGraphqlProps;

const RiskAreaRow: React.StatelessComponent<allProps> = (props: allProps) => {
  const { riskArea, selected, routeBase, riskAreaGroup } = props;
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
          <span className={styles.dateLabel}>Domain:</span>
          <span className={styles.dateValue}>{riskAreaGroup && riskAreaGroup.title}</span>
        </div>
        <div className={classNames(riskAreasStyles.dateSection, riskAreasStyles.orderSection)}>
          <span className={styles.dateLabel}>Type:</span>
          <span className={styles.dateValue}>{riskArea.assessmentType}</span>
        </div>
        <div className={classNames(riskAreasStyles.dateSection, riskAreasStyles.orderSection)}>
          <span className={styles.dateLabel}>Medium Risk Threshold:</span>
          <span className={styles.dateValue}>{riskArea.mediumRiskThreshold}</span>
        </div>
        <div className={classNames(riskAreasStyles.dateSection, riskAreasStyles.orderSection)}>
          <span className={styles.dateLabel}>High Risk Threshold:</span>
          <span className={styles.dateValue}>{riskArea.highRiskThreshold}</span>
        </div>
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

export default graphql(riskAreaGroupShortQueryGraphql, {
  options: (props: IProps) => ({
    variables: { riskAreaGroupId: props.riskArea.riskAreaGroupId },
  }),
  props: ({ data }) => ({
    riskAreaGroup: data ? (data as any).riskAreaGroup : null,
  }),
})(RiskAreaRow);
