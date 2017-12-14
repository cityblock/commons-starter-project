import * as React from 'react';
import { connect } from 'react-redux';
import * as styles from '../../shared/css/two-panel.css';
import Button from '../../shared/library/button/button';
import { IState as IAppState } from '../../store';
import RiskAreaGroups from './risk-area-groups';

export const ROUTE_BASE = '/builder/domains';

interface IProps {
  match: {
    params: {
      riskAreaGroupId?: string;
    };
  };
}

interface IStateProps {
  riskAreaGroupId: string | null;
}

type allProps = IStateProps & IProps;

export const AdminRiskAreaGroups: React.StatelessComponent<allProps> = (props: allProps) => {
  const { riskAreaGroupId } = props;

  return (
    <div className={styles.container}>
      <div className={styles.sortSearchBar}>
        <Button messageId="riskAreaGroup.create" onClick={() => true as any} />
      </div>
      <div className={styles.bottomContainer}>
        <RiskAreaGroups riskAreaGroupId={riskAreaGroupId} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState, ownProps: IProps): IStateProps => {
  return {
    riskAreaGroupId: ownProps.match.params.riskAreaGroupId || null,
  };
};

export default connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps)(
  AdminRiskAreaGroups,
);
