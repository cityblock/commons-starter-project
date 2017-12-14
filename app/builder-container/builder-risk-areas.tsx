import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
/* tslint:disable:max-line-length */
import * as riskAreaDeleteMutationGraphql from '../graphql/queries/risk-area-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  riskAreaDeleteMutation,
  riskAreaDeleteMutationVariables,
  FullRiskAreaFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
import { IState as IAppState } from '../store';
import RiskArea from './risk-area';
import RiskAreaCreate from './risk-area-create';
import { RiskAreaRow } from './risk-area-row';

interface IProps {
  mutate?: any;
  match: {
    params: {
      riskAreaId?: string;
    };
  };
}

interface IStateProps {
  riskAreaId: string | null;
}

interface IGraphqlProps {
  riskAreas?: FullRiskAreaFragment[];
  loading?: boolean;
  error: string | null;
  deleteRiskArea: (
    options: { variables: riskAreaDeleteMutationVariables },
  ) => { data: riskAreaDeleteMutation };
}

interface IDispatchProps {
  redirectToRiskAreas: () => any;
}

type allProps = IProps & IGraphqlProps & IDispatchProps & IStateProps;

interface IState {
  showCreateRiskArea: boolean;
  loading?: boolean;
  error: string | null;
}

const ROUTE_BASE = '/builder/assessments';

class AdminRiskAreas extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.renderRiskAreas = this.renderRiskAreas.bind(this);
    this.renderRiskArea = this.renderRiskArea.bind(this);
    this.showCreateRiskArea = this.showCreateRiskArea.bind(this);
    this.hideCreateRiskArea = this.hideCreateRiskArea.bind(this);
    this.onDeleteRiskArea = this.onDeleteRiskArea.bind(this);

    this.state = {
      showCreateRiskArea: false,
      error: null,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { loading, error } = nextProps;

    this.setState({ loading, error });
  }

  showCreateRiskArea() {
    this.setState({ showCreateRiskArea: true });
  }

  hideCreateRiskArea(riskArea?: FullRiskAreaFragment) {
    this.setState({ showCreateRiskArea: false });
  }

  renderRiskAreas(riskAreas: FullRiskAreaFragment[]) {
    const { loading, error } = this.props;
    const validRiskAreas = riskAreas.filter(riskArea => !riskArea.deletedAt);

    if (validRiskAreas.length > 0) {
      return validRiskAreas.map(this.renderRiskArea);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo} />
          <div className={styles.emptyLabel}>No Assessments</div>
        </div>
      );
    }
  }

  renderRiskArea(riskArea: FullRiskAreaFragment) {
    const selected = riskArea.id === this.props.riskAreaId;
    return (
      <RiskAreaRow
        key={riskArea.id}
        riskArea={riskArea}
        selected={selected}
        routeBase={ROUTE_BASE}
      />
    );
  }

  async onDeleteRiskArea(riskAreaId: string) {
    const { redirectToRiskAreas, deleteRiskArea } = this.props;

    await deleteRiskArea({ variables: { riskAreaId } });

    redirectToRiskAreas();
  }

  render() {
    const { riskAreas, riskAreaId } = this.props;
    const { showCreateRiskArea } = this.state;
    const riskAreasList = riskAreas || [];
    const riskAreaContainerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!riskAreaId || showCreateRiskArea,
    });
    const riskAreasListStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!riskAreaId || showCreateRiskArea,
    });
    const createRiskAreaButton = (
      <div className={styles.createContainer}>
        <div onClick={this.showCreateRiskArea} className={styles.createButton}>
          Create Assessment
        </div>
      </div>
    );
    const createRiskAreaHtml = showCreateRiskArea ? (
      <RiskAreaCreate onClose={this.hideCreateRiskArea} routeBase={ROUTE_BASE} />
    ) : null;
    const RenderedRiskArea = (props: any) => (
      <RiskArea routeBase={ROUTE_BASE} onDelete={this.onDeleteRiskArea} {...props} />
    );
    const riskAreaHtml = showCreateRiskArea ? null : (
      <Route path={`${ROUTE_BASE}/:riskAreaId`} render={RenderedRiskArea} />
    );
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>{createRiskAreaButton}</div>
        <div className={styles.bottomContainer}>
          <div className={riskAreasListStyles}>{this.renderRiskAreas(riskAreasList)}</div>
          <div className={riskAreaContainerStyles}>
            {riskAreaHtml}
            {createRiskAreaHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    riskAreaId: ownProps.match.params.riskAreaId || null,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps {
  return {
    redirectToRiskAreas: () => {
      dispatch(push(ROUTE_BASE));
    },
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, IProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, IProps, allProps>(riskAreasQuery as any, {
    props: ({ data }) => ({
      riskAreasLoading: data ? data.loading : false,
      riskAreasError: data ? data.error : null,
      riskAreas: data ? (data as any).riskAreas : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaDeleteMutationGraphql as any, {
    name: 'deleteRiskArea',
  }),
)(AdminRiskAreas);
