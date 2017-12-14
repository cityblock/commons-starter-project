import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as riskAreaGroupsQuery from '../../graphql/queries/get-risk-area-groups.graphql';
import { FullRiskAreaGroupFragment } from '../../graphql/types';
import * as styles from '../../shared/css/two-panel.css';
import Button from '../../shared/library/button/button';
import Spinner from '../../shared/library/spinner/spinner';
import { IState as IAppState } from '../../store';
import RiskAreaGroupDetail from './risk-area-group-detail';
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

interface IDispatchProps {
  redirectToRiskAreaGroups: () => void;
}

interface IGraphqlProps {
  riskAreaGroups: FullRiskAreaGroupFragment[];
  loading: boolean;
  error: string | null;
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps & IProps;

interface IState {
  createMode: boolean;
}

export class AdminRiskAreaGroups extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = { createMode: false };
  }

  render(): JSX.Element {
    const {
      riskAreaGroupId,
      riskAreaGroups,
      redirectToRiskAreaGroups,
      loading,
      error,
    } = this.props;
    const { createMode } = this.state;

    if (loading || error) return <Spinner />;

    const containerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!riskAreaGroupId || createMode,
    });
    const listStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!riskAreaGroupId || createMode,
    });

    const selectedRiskAreaGroup = riskAreaGroupId
      ? riskAreaGroups.find(group => group.id === riskAreaGroupId) || null
      : null;

    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          <Button
            messageId="riskAreaGroup.create"
            onClick={() => this.setState({ createMode: true })}
          />
        </div>
        <div className={styles.bottomContainer}>
          <div className={listStyles}>
            <RiskAreaGroups riskAreaGroupId={riskAreaGroupId} riskAreaGroups={riskAreaGroups} />
          </div>
          <div className={containerStyles}>
            <RiskAreaGroupDetail
              riskAreaGroup={selectedRiskAreaGroup}
              close={redirectToRiskAreaGroups}
              createMode={createMode}
              cancelCreateRiskAreaGroup={() => this.setState({ createMode: false })}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps: IProps): IStateProps => {
  return {
    riskAreaGroupId: ownProps.match.params.riskAreaGroupId || null,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => {
  return {
    redirectToRiskAreaGroups: () => dispatch(push(ROUTE_BASE)),
  };
};

export default compose(
  connect<IStateProps, IDispatchProps, IProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaGroupsQuery as any, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      eror: data ? data.error : null,
      riskAreaGroups: data ? (data as any).riskAreaGroups : null,
    }),
  }),
)(AdminRiskAreaGroups);
