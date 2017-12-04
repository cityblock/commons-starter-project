import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
import * as screeningToolsQuery from '../graphql/queries/get-screening-tools.graphql';
/* tslint:disable:max-line-length */
import * as screeningToolDeleteMutationGraphql from '../graphql/queries/screening-tool-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  screeningToolDeleteMutation,
  screeningToolDeleteMutationVariables,
  FullRiskAreaFragment,
  FullScreeningToolFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
import { IState as IAppState } from '../store';
import ScreeningTool from './screening-tool';
import ScreeningToolCreate from './screening-tool-create';
import { ScreeningToolRow } from './screening-tool-row';

interface IProps {
  match: {
    params: {
      toolId?: string;
    };
  };
  mutate?: any;
}

interface IStateProps {
  screeningToolId?: string;
  routeBase: string;
}

interface IDispatchProps {
  redirectToScreeningTools: () => any;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string;
  riskAreas?: FullRiskAreaFragment[];
  screeningTools?: FullScreeningToolFragment[];
  deleteScreeningTool: (
    options: { variables: screeningToolDeleteMutationVariables },
  ) => { data: screeningToolDeleteMutation };
}

interface IState {
  showCreateScreeningTool: boolean;
  loading?: boolean;
  error?: string;
}

type allProps = IProps & IDispatchProps & IGraphqlProps & IStateProps;

class BuilderScreeningTools extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.renderScreeningTools = this.renderScreeningTools.bind(this);
    this.renderScreeningTool = this.renderScreeningTool.bind(this);
    this.showCreateScreeningTool = this.showCreateScreeningTool.bind(this);
    this.hideCreateScreeningTool = this.hideCreateScreeningTool.bind(this);
    this.onDeleteScreeningTool = this.onDeleteScreeningTool.bind(this);

    this.state = {
      showCreateScreeningTool: false,
    };
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
    const { redirectToScreeningTools, deleteScreeningTool } = this.props;

    await deleteScreeningTool({ variables: { screeningToolId } });

    redirectToScreeningTools();
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
        <div onClick={this.showCreateScreeningTool} className={styles.createButton}>
          Create Screening Tool
        </div>
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

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: allProps): IDispatchProps {
  return {
    redirectToScreeningTools: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, allProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolDeleteMutationGraphql as any, {
    name: 'deleteScreeningTool',
  }),
  graphql<IGraphqlProps, IProps, allProps>(riskAreasQuery as any, {
    props: ({ data }) => ({
      riskAreasLoading: data ? data.loading : false,
      riskAreasError: data ? data.error : null,
      riskAreas: data ? (data as any).riskAreas : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolsQuery as any, {
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningTools : null,
    }),
  }),
)(BuilderScreeningTools);
