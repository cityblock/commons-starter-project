import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as riskAreaDeleteMutationGraphql from '../graphql/queries/risk-area-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  riskAreaDeleteMutation,
  riskAreaDeleteMutationVariables,
  FullRiskAreaFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
import RiskArea from './risk-area';
import RiskAreaCreate from './risk-area-create';
import { RiskAreaRow } from './risk-area-row';

export interface IComponentProps {
  routeBase: string;
  riskAreas?: FullRiskAreaFragment[];
  riskAreaId?: string;
}

interface IProps extends IComponentProps {
  loading?: boolean;
  error?: string;
  mutate: any;
  deleteRiskArea: (
    options: { variables: riskAreaDeleteMutationVariables },
  ) => { data: riskAreaDeleteMutation };
  redirectToRiskAreas: () => any;
}

interface IState {
  showCreateRiskArea: false;
}

class AdminRiskAreas extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.renderRiskAreas = this.renderRiskAreas.bind(this);
    this.renderRiskArea = this.renderRiskArea.bind(this);
    this.showCreateRiskArea = this.showCreateRiskArea.bind(this);
    this.hideCreateRiskArea = this.hideCreateRiskArea.bind(this);
    this.onDeleteRiskArea = this.onDeleteRiskArea.bind(this);

    this.state = {
      showCreateRiskArea: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error } = nextProps;

    this.setState(() => ({ loading, error }));
  }

  showCreateRiskArea() {
    this.setState(() => ({ showCreateRiskArea: true }));
  }

  hideCreateRiskArea(riskArea?: FullRiskAreaFragment) {
    this.setState(() => ({ showCreateRiskArea: false }));
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
          <div className={styles.emptyLabel}>No RiskAreas</div>
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
        routeBase={this.props.routeBase}
      />
    );
  }

  async onDeleteRiskArea(riskAreaId: string) {
    const { redirectToRiskAreas, deleteRiskArea } = this.props;

    await deleteRiskArea({ variables: { riskAreaId } });

    redirectToRiskAreas();
  }

  render() {
    const { riskAreas, routeBase, riskAreaId } = this.props;
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
          Create Domain
        </div>
      </div>
    );
    const createRiskAreaHtml = showCreateRiskArea ? (
      <RiskAreaCreate onClose={this.hideCreateRiskArea} routeBase={this.props.routeBase} />
    ) : null;
    const RenderedRiskArea = (props: any) => (
      <RiskArea routeBase={routeBase} onDelete={this.onDeleteRiskArea} {...props} />
    );
    const riskAreaHtml = showCreateRiskArea ? null : (
      <Route path={`${routeBase}/:riskAreaId`} render={RenderedRiskArea} />
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

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToRiskAreas: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
  };
}

export default compose(
  connect<{}, {}, IComponentProps>(null, mapDispatchToProps),
  graphql(riskAreaDeleteMutationGraphql as any, { name: 'deleteRiskArea' }),
)(AdminRiskAreas);
