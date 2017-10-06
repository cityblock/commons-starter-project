import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as concernDeleteMutation from '../graphql/queries/concern-delete-mutation.graphql';
import {
  concernDeleteMutationVariables,
  FullConcernFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
import Concern from './concern';
import ConcernCreate from './concern-create';
import { ConcernRow } from './concern-row';

interface IComponentProps {
  routeBase: string;
  concerns?: FullConcernFragment[];
  concernId?: string;
}

interface IProps extends IComponentProps {
  loading?: boolean;
  error?: string;
  mutate: any;
  deleteConcern: (
    options: { variables: concernDeleteMutationVariables },
  ) => { data: { riskAreaDelete: FullConcernFragment } };
  redirectToConcerns: () => any;
}

interface IState {
  showCreateConcern: false;
}

class BuilderConcerns extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.renderConcerns = this.renderConcerns.bind(this);
    this.renderConcern = this.renderConcern.bind(this);
    this.showCreateConcern = this.showCreateConcern.bind(this);
    this.hideCreateConcern = this.hideCreateConcern.bind(this);
    this.onDeleteConcern = this.onDeleteConcern.bind(this);

    this.state = {
      showCreateConcern: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error } = nextProps;

    this.setState(() => ({ loading, error }));
  }

  showCreateConcern() {
    this.setState(() => ({ showCreateConcern: true }));
  }

  hideCreateConcern(riskArea?: FullConcernFragment) {
    this.setState(() => ({ showCreateConcern: false }));
  }

  renderConcerns(concerns: FullConcernFragment[]) {
    const { loading, error } = this.props;
    const validConcerns = concerns.filter(concern => !concern.deletedAt);

    if (validConcerns.length > 0) {
      return validConcerns.map(this.renderConcern);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo}></div>
          <div className={styles.emptyLabel}>No Concerns</div>
        </div>
      );
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
        <div
          onClick={this.showCreateConcern}
          className={styles.createButton}>Create Concern</div>
      </div>
    );
    const createConcernHtml = showCreateConcern ? (
      <ConcernCreate
        onClose={this.hideCreateConcern}
        routeBase={this.props.routeBase} />
    ) : null;
    const RenderedConcern = (props: any) => (
      <Concern routeBase={routeBase} onDelete={this.onDeleteConcern} {...props} />
    );
    const concernHtml = showCreateConcern ?
      null : (<Route path={`${routeBase}/:objectId`} render={RenderedConcern} />);
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          {createConcernButton}
        </div>
        <div className={styles.bottomContainer}>
          <div className={concernsListStyles}>
            {this.renderConcerns(concernsList)}
          </div>
          <div className={concernContainerStyles}>
            {concernHtml}
            {createConcernHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToConcerns: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
  };
}

export default (compose)(
  connect<any, any, IComponentProps>(null, mapDispatchToProps),
  graphql(concernDeleteMutation as any, { name: 'deleteConcern' }),
)(BuilderConcerns);
