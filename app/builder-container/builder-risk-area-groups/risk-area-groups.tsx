import React from 'react';
import { FullRiskAreaGroupFragment } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import { ROUTE_BASE } from './builder-risk-area-groups';
import RiskAreaGroup from './risk-area-group';

interface IProps {
  riskAreaGroupId: string | null;
  riskAreaGroups: FullRiskAreaGroupFragment[];
}

const RiskAreaGroups: React.StatelessComponent<IProps> = (props: IProps) => {
  const { riskAreaGroupId, riskAreaGroups } = props;

  if (!riskAreaGroups.length) {
    return <EmptyPlaceholder headerMessageId="riskAreaGroup.empty" icon="addBox" />;
  }

  const renderedRiskAreaGroups = riskAreaGroups.map(group => (
    <RiskAreaGroup
      key={group.id}
      riskAreaGroup={group}
      selected={group.id === riskAreaGroupId}
      routeBase={ROUTE_BASE}
    />
  ));

  return <div>{renderedRiskAreaGroups}</div>;
};

export default RiskAreaGroups;
