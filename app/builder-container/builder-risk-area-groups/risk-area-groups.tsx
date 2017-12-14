import * as React from 'react';
import { graphql } from 'react-apollo';
import * as riskAreaGroupsQuery from '../../graphql/queries/get-risk-area-groups.graphql';
import { FullRiskAreaGroupFragment } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import Spinner from '../../shared/library/spinner/spinner';
import { ROUTE_BASE } from './builder-risk-area-groups';
import RiskAreaGroup from './risk-area-group';

interface IProps {
  riskAreaGroupId: string | null;
}

interface IGraphqlProps {
  riskAreaGroups: FullRiskAreaGroupFragment[];
  loading: boolean;
  error: string | null;
}

type allProps = IGraphqlProps & IProps;

export const RiskAreaGroups: React.StatelessComponent<allProps> = (props: allProps) => {
  const { riskAreaGroupId, riskAreaGroups, loading, error } = props;

  if (loading || error) {
    return <Spinner />;
  } else if (!riskAreaGroups.length) {
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

export default graphql<IGraphqlProps, IProps, allProps>(riskAreaGroupsQuery as any, {
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    eror: data ? data.error : null,
    riskAreaGroups: data ? (data as any).riskAreaGroups : null,
  }),
})(RiskAreaGroups);
