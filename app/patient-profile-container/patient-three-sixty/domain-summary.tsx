import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { FullRiskAreaGroupForPatientFragment } from '../../graphql/types';
import DateInfo from '../../shared/library/date-info/date-info';
import Icon from '../../shared/library/icon/icon';
import styles from './css/domain-summary.css';
import DomainSummaryBullets from './domain-summary-bullets';

interface IProps {
  routeBase: string;
  patientId: string;
  glassBreakId: string | null;
  riskAreaGroup: FullRiskAreaGroupForPatientFragment;
}

export const DomainSummary: React.StatelessComponent<IProps> = (props: IProps) => {
  const { routeBase, riskAreaGroup } = props;
  if (!riskAreaGroup) return null;

  const domainStyles = classNames(styles.domain, {
    [styles.redBorder]: riskAreaGroup.riskScore === 'high',
    [styles.yellowBorder]: riskAreaGroup.riskScore === 'medium',
    [styles.greenBorder]: riskAreaGroup.riskScore === 'low',
  });
  const noAutomated =
    !!riskAreaGroup.riskAreas &&
    !!riskAreaGroup.riskAreas.length &&
    !riskAreaGroup.riskAreas.some(area => {
      return area.assessmentType === 'automated';
    });
  // if no automated assessments, link directly to manual assessment (1 per domain)
  const href = noAutomated
    ? `${routeBase}/${riskAreaGroup.id}/assessment/${riskAreaGroup.riskAreas[0].id}`
    : `${routeBase}/${riskAreaGroup.id}`;

  return (
    <Link to={href} className={domainStyles}>
      <div className={classNames(styles.flex, styles.header)}>
        <div className={styles.flex}>
          <Icon name="home" className={styles.icon} />
          <h3>{riskAreaGroup.title}</h3>
        </div>
        {riskAreaGroup.lastUpdated && <DateInfo label="updated" date={riskAreaGroup.lastUpdated} />}
      </div>
      <DomainSummaryBullets
        screeningToolResultSummaries={riskAreaGroup.screeningToolResultSummaries}
        automatedSummaryText={riskAreaGroup.automatedSummaryText}
        manualSummaryText={riskAreaGroup.manualSummaryText}
      />
    </Link>
  );
};
