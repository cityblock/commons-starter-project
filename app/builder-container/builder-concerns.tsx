import classNames from 'classnames';
import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import concernDeleteGraphql from '../graphql/queries/concern-delete-mutation.graphql';
import concerns from '../graphql/queries/get-concerns.graphql';
import { concernDelete, concernDeleteVariables, FullConcern } from '../graphql/types';
import styles from '../shared/css/two-panel.css';
import Button from '../shared/library/button/button';
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
  concerns?: FullConcern[];
  deleteConcern: (options: { variables: concernDeleteVariables }) => { data: concernDelete };
}

type allProps = IGraphqlProps & IProps;

interface IState {
  showCreateConcern: boolean;
  routeBase: string;
  concernId: string | null;
}

class BuilderConcerns extends React.Component<allProps, IState> {
  static getDerivedStateFromProps(nextProps: IProps) {
    if (nextProps && nextProps.match && nextProps.match.params.concernId) {
      return { concernId: nextProps.match.params.concernId };
    }
    return null;
  }

  state: IState = {
    showCreateConcern: false,
    routeBase: '/builder/concerns',
    concernId: null,
  };

  renderConcerns(concernsList: FullConcern[]) {
    const validConcerns = concernsList.filter(concern => !concern.deletedAt);

    if (validConcerns.length > 0) {
      return validConcerns.map(this.renderConcern);
    }
  }

  showCreateConcern = () => {
    this.setState({ showCreateConcern: true });
  };

  hideCreateConcern = () => {
    this.setState({ showCreateConcern: false });
  };

  renderConcern = (concern: FullConcern) => {
    const selected = concern.id === this.state.concernId;
    return (
      <ConcernRow
        key={concern.id}
        concern={concern}
        selected={selected}
        routeBase={this.state.routeBase}
      />
    );
  };

  onDeleteConcern = async (concernId: string) => {
    const { history, deleteConcern } = this.props;
    const { routeBase } = this.state;

    await deleteConcern({ variables: { concernId } });

    history.push(routeBase);
  };

  render() {
    const { showCreateConcern, routeBase, concernId } = this.state;
    const concernsList = this.props.concerns || [];
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
      <ConcernCreate onClose={this.hideCreateConcern} routeBase={routeBase} />
    ) : null;
    const RenderedConcern = (props: any) => (
      <Concern
        key={concernId || 'blank'}
        concernId={concernId}
        routeBase={routeBase}
        onDelete={this.onDeleteConcern}
      />
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

export default compose(
  withRouter,
  graphql(concerns, {
    props: ({ data }) => ({
      concernsLoading: data ? data.loading : false,
      concernsError: data ? data.error : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql(concernDeleteGraphql, {
    name: 'deleteConcern',
  }),
)(BuilderConcerns) as React.ComponentClass<IProps>;
