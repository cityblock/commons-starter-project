import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import * as riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
import * as riskAreaDeleteMutationGraphql from '../graphql/queries/risk-area-delete-mutation.graphql';
import {
  riskAreaDeleteMutation,
  riskAreaDeleteMutationVariables,
  FullRiskAreaFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
import Button from '../shared/library/button/button';
import { IState as IAppState } from '../store';
import RiskArea from './risk-area';
import RiskAreaCreate from './risk-area-create';
import RiskAreaRow from './risk-area-row';

interface IProps {
  mutate?: any;
  match: {
    params: {
      riskAreaId?: string;
    };
  };
  history: History;
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

type allProps = IProps & IGraphqlProps & IStateProps;

interface IState {
  showCreateRiskArea: boolean;
  loading?: boolean;
  error: string | null;
}

const ROUTE_BASE = '/builder/assessments';

class AdminRiskAreas extends React.Component<allProps, IState> {
  state = {
    showCreateRiskArea: false,
    error: null,
  };

  constructor(props: allProps) {
    super(props);

    this.renderRiskAreas = this.renderRiskAreas.bind(this);
    this.renderRiskArea = this.renderRiskArea.bind(this);
    this.showCreateRiskArea = this.showCreateRiskArea.bind(this);
    this.hideCreateRiskArea = this.hideCreateRiskArea.bind(this);
    this.onDeleteRiskArea = this.onDeleteRiskArea.bind(this);
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
    const { history, deleteRiskArea } = this.props;

    await deleteRiskArea({ variables: { riskAreaId } });

    history.push(ROUTE_BASE);
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
        <Button onClick={this.showCreateRiskArea} messageId="builder.createAssessment" />
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

export default compose(
  withRouter,
  connect<IStateProps, {}, IProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(riskAreasQuery as any, {
    props: ({ data }) => ({
      riskAreasLoading: data ? data.loading : false,
      riskAreasError: data ? data.error : null,
      riskAreas: data ? (data as any).riskAreas : null,
    }),
  }),
  graphql(riskAreaDeleteMutationGraphql as any, {
    name: 'deleteRiskArea',
  }),
)(AdminRiskAreas) as React.ComponentClass<IProps>;
