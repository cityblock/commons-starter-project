import classNames from 'classnames';
import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
import screeningToolsQuery from '../graphql/queries/get-screening-tools.graphql';
import screeningToolDeleteMutationGraphql from '../graphql/queries/screening-tool-delete-mutation.graphql';
import {
  screeningToolDeleteMutation,
  screeningToolDeleteMutationVariables,
  FullRiskAreaFragment,
  FullScreeningToolFragment,
} from '../graphql/types';
import styles from '../shared/css/two-panel.css';
import Button from '../shared/library/button/button';
import { IState as IAppState } from '../store';
import ScreeningTool from './screening-tool';
import ScreeningToolCreate from './screening-tool-create';
import { ScreeningToolRow } from './screening-tool-row';

interface IProps {
  match: {
    params: {
      toolId: string | null;
    };
  };
  mutate?: any;
}

interface IRouterProps {
  history: History;
}

interface IStateProps {
  screeningToolId: string | null;
  routeBase: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  riskAreas?: FullRiskAreaFragment[];
  screeningTools?: FullScreeningToolFragment[];
  deleteScreeningTool: (
    options: { variables: screeningToolDeleteMutationVariables },
  ) => { data: screeningToolDeleteMutation };
}

interface IState {
  showCreateScreeningTool: boolean;
  loading?: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps & IStateProps & IRouterProps;

class BuilderScreeningTools extends React.Component<allProps, IState> {
  state = {
    showCreateScreeningTool: false,
    error: null,
  };

  constructor(props: allProps) {
    super(props);

    this.renderScreeningTools = this.renderScreeningTools.bind(this);
    this.renderScreeningTool = this.renderScreeningTool.bind(this);
    this.showCreateScreeningTool = this.showCreateScreeningTool.bind(this);
    this.hideCreateScreeningTool = this.hideCreateScreeningTool.bind(this);
    this.onDeleteScreeningTool = this.onDeleteScreeningTool.bind(this);
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { loading, error } = nextProps;

    this.setState({ loading, error });
  }

  showCreateScreeningTool() {
    this.setState({ showCreateScreeningTool: true });
  }

  hideCreateScreeningTool(screeningTool?: FullScreeningToolFragment) {
    this.setState({ showCreateScreeningTool: false });
  }

  renderScreeningTools(screeningTools: FullScreeningToolFragment[]) {
    const { loading, error } = this.props;
    const validScreeningTools = screeningTools.filter(screeningTool => !screeningTool.deletedAt);

    if (validScreeningTools.length > 0) {
      return validScreeningTools.map(this.renderScreeningTool);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo} />
          <div className={styles.emptyLabel}>No Screening Tools</div>
        </div>
      );
    }
  }

  renderScreeningTool(screeningTool: FullScreeningToolFragment) {
    const selected = screeningTool.id === this.props.screeningToolId;
    return (
      <ScreeningToolRow
        key={screeningTool.id}
        screeningTool={screeningTool}
        selected={selected}
        routeBase={this.props.routeBase}
      />
    );
  }

  async onDeleteScreeningTool(screeningToolId: string) {
    const { history, routeBase, deleteScreeningTool } = this.props;

    await deleteScreeningTool({ variables: { screeningToolId } });

    history.push(routeBase);
  }

  render() {
    const { screeningTools, riskAreas, routeBase, screeningToolId } = this.props;
    const { showCreateScreeningTool } = this.state;
    const screeningToolsList = screeningTools || [];
    const screeningToolContainerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!screeningToolId || showCreateScreeningTool,
    });
    const screeningToolsListStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!screeningToolId || showCreateScreeningTool,
    });
    const createScreeningToolButton = (
      <div className={styles.createContainer}>
        <Button onClick={this.showCreateScreeningTool} messageId="builder.createScreeningTool" />
      </div>
    );
    const createScreeningToolHtml = showCreateScreeningTool ? (
      <ScreeningToolCreate
        onClose={this.hideCreateScreeningTool}
        riskAreas={riskAreas}
        routeBase={this.props.routeBase}
      />
    ) : null;
    const RenderedScreeningTool = (props: any) => (
      <ScreeningTool routeBase={routeBase} onDelete={this.onDeleteScreeningTool} {...props} />
    );
    const screeningToolHtml = showCreateScreeningTool ? null : (
      <Route path={`${routeBase}/:screeningToolId`} render={RenderedScreeningTool} />
    );
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>{createScreeningToolButton}</div>
        <div className={styles.bottomContainer}>
          <div className={screeningToolsListStyles}>
            {this.renderScreeningTools(screeningToolsList)}
          </div>
          <div className={screeningToolContainerStyles}>
            {screeningToolHtml}
            {createScreeningToolHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    screeningToolId: ownProps.match.params.toolId,
    routeBase: '/builder/tools',
  };
}

export default compose(
  withRouter,
  connect<IStateProps, {}, allProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(screeningToolDeleteMutationGraphql, {
    name: 'deleteScreeningTool',
  }),
  graphql(riskAreasQuery, {
    props: ({ data }) => ({
      riskAreasLoading: data ? data.loading : false,
      riskAreasError: data ? data.error : null,
      riskAreas: data ? (data as any).riskAreas : null,
    }),
  }),
  graphql(screeningToolsQuery, {
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningTools : null,
    }),
  }),
)(BuilderScreeningTools) as React.ComponentClass<IProps>;
