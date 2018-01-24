import * as React from 'react';
import { FullCBOFragment } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import { ROUTE_BASE } from './builder-cbos';
import CBO from './cbo';

interface IProps {
  CBOId: string | null;
  CBOItems: FullCBOFragment[];
}

const CBOs: React.StatelessComponent<IProps> = (props: IProps) => {
  const { CBOId, CBOItems } = props;

  if (!CBOItems.length) {
    return <EmptyPlaceholder headerMessageId="CBOs.empty" icon="addBox" />;
  }

  const renderedCBOs = CBOItems.map(CBOItem => (
    <CBO
      key={CBOItem.id}
      CBOItem={CBOItem}
      selected={CBOItem.id === CBOId}
      routeBase={ROUTE_BASE}
    />
  ));

  return <div>{renderedCBOs}</div>;
};

export default CBOs;
