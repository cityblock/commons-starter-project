import * as classNames from 'classnames';
import * as React from 'react';
import { getRiskAreaGroupsForPatientQuery } from '../../graphql/types';
import * as styles from './css/shared.css';
import { DomainSummary } from './domain-summary';
import { ThreeSixtyRadar } from './three-sixty-radar/three-sixty-radar';

interface IProps {
  patientId: string;
  routeBase: string;
  riskAreaGroups: getRiskAreaGroupsForPatientQuery['riskAreaGroupsForPatient'];
  glassBreakId: string | null;
}

export const DomainSummaries: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientId, routeBase, riskAreaGroups, glassBreakId } = props;

  const domainSummaries = riskAreaGroups.map(group => {
    return (
      <DomainSummary
        key={group.id}
        routeBase={routeBase}
        patientId={patientId}
        riskAreaGroup={group}
        glassBreakId={glassBreakId}
      />
    );
  });

  return (
    <React.Fragment>
      <div className={classNames(styles.scroll, styles.domains)}>{domainSummaries}</div>
      <ThreeSixtyRadar riskAreaGroups={riskAreaGroups} />
    </React.Fragment>
  );
};
