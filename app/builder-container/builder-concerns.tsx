import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as concernDeleteMutationGraphql from '../graphql/queries/concern-delete-mutation.graphql';
import * as concernsQuery from '../graphql/queries/get-concerns.graphql';
import {
  concernDeleteMutation,
  concernDeleteMutationVariables,
  FullConcernFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
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
}

interface IGraphqlProps {
  concerns?: FullConcernFragment[];
  deleteConcern: (
    options: { variables: concernDeleteMutationVariables },
  ) => { data: concernDeleteMutation };
}

interface IStateProps {
  routeBase: string;
  concernId?: string;
}

interface IDispatchProps {
  redirectToConcerns: () => any;
}

type allProps = IGraphqlProps & IDispatchProps & IProps & IStateProps;

interface IState {
  showCreateConcern: boolean;
}

class BuilderConcerns extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.renderConcerns = this.renderConcerns.bind(this);
    this.renderConcern = this.renderConcern.bind(this);
    this.onDeleteConcern = this.onDeleteConcern.bind(this);

    this.state = {
      showCreateConcern: false,
    };
  }

  showCreateConcern = () => {
    this.setState({ showCreateConcern: true });
  };

  hideCreateConcern = (riskArea?: FullConcernFragment) => {
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

  async onDeleteConcern(concernId: string) {
    const { redirectToConcerns, deleteConcern } = this.props;

    await deleteConcern({ variables: { concernId } });

    redirectToConcerns();
  }

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
        <div onClick={this.showCreateConcern} className={styles.createButton}>
          Create Concern
        </div>
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

function mapDispatchToProps(
  dispatch: Dispatch<() => void>,
  ownProps: IProps & IStateProps,
): IDispatchProps {
  return {
    redirectToConcerns: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, allProps>(mapStateToProps as any, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(concernsQuery as any, {
    props: ({ data }) => ({
      concernsLoading: data ? data.loading : false,
      concernsError: data ? data.error : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(concernDeleteMutationGraphql as any, {
    name: 'deleteConcern',
  }),
)(BuilderConcerns);
