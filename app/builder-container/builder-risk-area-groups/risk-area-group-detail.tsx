import { isEqual } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as riskAreaGroupDeleteMutationGraphql from '../../graphql/queries/risk-area-group-delete-mutation.graphql';
import {
  riskAreaGroupDeleteMutation,
  riskAreaGroupDeleteMutationVariables,
  FullRiskAreaGroupFragment,
} from '../../graphql/types';
import DeleteWarning from '../../shared/library/delete-warning/delete-warning';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../shared/with-error-handler/with-error-handler';
import * as styles from './css/risk-area-group-detail.css';
import RiskAreaGroupCreate from './risk-area-group-create';
import RiskAreaGroupEdit from './risk-area-group-edit';

interface IProps {
  riskAreaGroup: FullRiskAreaGroupFragment | null;
  close: () => void;
  createMode: boolean;
  cancelCreateRiskAreaGroup: () => void;
}

interface IGraphqlProps {
  deleteRiskAreaGroup: (
    options: { variables: riskAreaGroupDeleteMutationVariables },
  ) => { data: riskAreaGroupDeleteMutation };
}

type allProps = IGraphqlProps & IProps & IInjectedErrorProps;

interface IState {
  deleteMode: boolean;
  loading: boolean;
}

export class RiskAreaGroupDetail extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState(): IState {
    return { deleteMode: false, loading: false };
  }

  componentWillReceiveProps(nextProps: allProps) {
    // reset view if clicking between risk area groups
    if (!isEqual(this.props.riskAreaGroup, nextProps.riskAreaGroup)) {
      this.setState(this.getInitialState());
    }
  }

  onDelete = async () => {
    const { deleteRiskAreaGroup, riskAreaGroup, close, openErrorPopup } = this.props;
    if (!riskAreaGroup) return;

    if (!this.state.loading) {
      this.setState({ loading: true });

      try {
        await deleteRiskAreaGroup({ variables: { riskAreaGroupId: riskAreaGroup.id } });
        close();
      } catch (err) {
        openErrorPopup(err.message);
      }

      this.setState({ loading: false });
    }
  };

  render(): JSX.Element | null {
    const { riskAreaGroup, close, createMode, cancelCreateRiskAreaGroup } = this.props;
    const { deleteMode } = this.state;

    if (!riskAreaGroup && !createMode) return null;

    const detailBody =
      createMode || !riskAreaGroup ? (
        <RiskAreaGroupCreate cancelCreateRiskAreaGroup={cancelCreateRiskAreaGroup} />
      ) : deleteMode ? (
        <DeleteWarning
          titleMessageId="riskAreaGroup.deleteWarning"
          deleteItem={this.onDelete}
          cancel={() => this.setState({ deleteMode: false })}
          deletedItemHeaderMessageId="riskAreaGroup.deleteDetail"
          deletedItemName={riskAreaGroup.title}
        />
      ) : (
        <RiskAreaGroupEdit
          riskAreaGroup={riskAreaGroup}
          close={close}
          deleteRiskAreaGroup={() => this.setState({ deleteMode: true })}
        />
      );

    return <div className={styles.container}>{detailBody}</div>;
  }
}

export default compose(
  withErrorHandler(),
  graphql(riskAreaGroupDeleteMutationGraphql as any, {
    name: 'deleteRiskAreaGroup',
    options: {
      refetchQueries: ['getRiskAreaGroups'],
    },
  }),
)(RiskAreaGroupDetail) as React.ComponentClass<IProps>;
