import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import * as concernDeleteMutationGraphql from '../graphql/queries/concern-delete-mutation.graphql';
import * as concernsQuery from '../graphql/queries/get-concerns.graphql';
import {
  concernDeleteMutation,
  concernDeleteMutationVariables,
  FullConcernFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
import Button from '../shared/library/button/button';
import { IState as IAppState } from '../store';
import Concern from './concern';
import ConcernCreate from './concern-create';
import { ConcernRow } from './concern-row';

interface IProps {
  mutate?: any;
  match: {
    params: {
      concernId: string;
    };
  };
  history: History;
}

interface IGraphqlProps {
  concerns?: FullConcernFragment[];
  deleteConcern: (
    options: { variables: concernDeleteMutationVariables },
  ) => { data: concernDeleteMutation };
}

interface IStateProps {
  routeBase: string;
  concernId: string | null;
}

type allProps = IGraphqlProps & IProps & IStateProps;

interface IState {
  showCreateConcern: boolean;
}

class BuilderConcerns extends React.Component<allProps, IState> {
  state = {
    showCreateConcern: false,
  };

  showCreateConcern = () => {
    this.setState({ showCreateConcern: true });
  };

  hideCreateConcern = () => {
    this.setState({ showCreateConcern: false });
  };

  renderConcerns(concerns: FullConcernFragment[]) {
    const validConcerns = concerns.filter(concern => !concern.deletedAt);

    if (validConcerns.length > 0) {
      return validConcerns.map(this.renderConcern);
    }
  }

  renderConcern(concern: FullConcernFragment) {
    const selected = concern.id === this.props.concernId;
    return (
      <ConcernRow
        key={concern.id}
        concern={concern}
        selected={selected}
        routeBase={this.props.routeBase}
      />
    );
  }

  onDeleteConcern = async (concernId: string) => {
    const { history, routeBase, deleteConcern } = this.props;

    await deleteConcern({ variables: { concernId } });

    history.push(routeBase);
  };

  render() {
    const { concerns, routeBase, concernId } = this.props;
    const { showCreateConcern } = this.state;
    const concernsList = concerns || [];
    const concernContainerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!concernId || showCreateConcern,
    });
    const concernsListStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!concernId || showCreateConcern,
    });
    const createConcernButton = (
      <div className={styles.createContainer}>
        <Button onClick={this.showCreateConcern} messageId="builder.createConcern" />
      </div>
    );
    const createConcernHtml = showCreateConcern ? (
      <ConcernCreate onClose={this.hideCreateConcern} routeBase={this.props.routeBase} />
    ) : null;
    const RenderedConcern = (props: any) => (
      <Concern routeBase={routeBase} onDelete={this.onDeleteConcern} {...props} />
    );
    const concernHtml = showCreateConcern ? null : (
      <Route path={`${routeBase}/:objectId`} render={RenderedConcern} />
    );
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>{createConcernButton}</div>
        <div className={styles.bottomContainer}>
          <div className={concernsListStyles}>{this.renderConcerns(concernsList)}</div>
          <div className={concernContainerStyles}>
            {concernHtml}
            {createConcernHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    concernId: ownProps.match.params.concernId,
    routeBase: '/builder/concerns',
  };
}

export default compose(
  withRouter,
  connect<IStateProps, {}, allProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(concernsQuery as any, {
    props: ({ data }) => ({
      concernsLoading: data ? data.loading : false,
      concernsError: data ? data.error : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql(concernDeleteMutationGraphql as any, {
    name: 'deleteConcern',
  }),
)(BuilderConcerns) as React.ComponentClass<IProps>;
