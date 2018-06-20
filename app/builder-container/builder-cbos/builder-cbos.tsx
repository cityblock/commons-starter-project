import classNames from 'classnames';
import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import CBOsQuery from '../../graphql/queries/get-cbos.graphql';
import { FullCBO } from '../../graphql/types';
import styles from '../../shared/css/two-panel.css';
import Button from '../../shared/library/button/button';
import Spinner from '../../shared/library/spinner/spinner';
import { IState as IAppState } from '../../store';
import CBODetail from './cbo-detail';
import CBOs from './cbos';

export const ROUTE_BASE = '/builder/CBOs';

interface IProps {
  match: {
    params: {
      CBOId?: string;
    };
  };
  history: History;
}

interface IStateProps {
  CBOId: string | null;
}

interface IGraphqlProps {
  CBOItems: FullCBO[];
  loading: boolean;
  error: string | null;
}

type allProps = IStateProps & IGraphqlProps & IProps;

interface IState {
  createMode: boolean;
}

export class AdminCBOs extends React.Component<allProps, IState> {
  state = { createMode: false };

  redirectToCBOs = () => this.props.history.push(ROUTE_BASE);

  render(): JSX.Element {
    const { CBOId, CBOItems, loading, error } = this.props;
    const { createMode } = this.state;

    if (loading || error) return <Spinner />;

    const containerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!CBOId || createMode,
    });
    const listStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!CBOId || createMode,
    });

    const selectedCBO = CBOId ? CBOItems.find(CBOItem => CBOItem.id === CBOId) || null : null;

    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          <Button messageId="CBOs.create" onClick={() => this.setState({ createMode: true })} />
        </div>
        <div className={styles.bottomContainer}>
          <div className={listStyles}>
            <CBOs CBOId={CBOId} CBOItems={CBOItems} />
          </div>
          <div className={containerStyles}>
            <CBODetail
              CBO={selectedCBO}
              close={this.redirectToCBOs}
              createMode={createMode}
              cancelCreateCBO={() => this.setState({ createMode: false })}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps: IProps): IStateProps => {
  return {
    CBOId: ownProps.match.params.CBOId || null,
  };
};

export default compose(
  withRouter,
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(CBOsQuery, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      CBOItems: data ? (data as any).CBOs : null,
    }),
  }),
)(AdminCBOs) as React.ComponentClass<IProps>;
