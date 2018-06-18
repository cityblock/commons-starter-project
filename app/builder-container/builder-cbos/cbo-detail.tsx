import React from 'react';
import { compose, graphql } from 'react-apollo';
import CBODeleteMutationGraphql from '../../graphql/queries/cbo-delete-mutation.graphql';
import {
  CBODeleteMutation,
  CBODeleteMutationVariables,
  FullCBOFragment,
} from '../../graphql/types';
import DeleteWarning from '../../shared/library/delete-warning/delete-warning';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../shared/with-error-handler/with-error-handler';
import CBOCreate from './cbo-create';
import CBOEdit from './cbo-edit';
import styles from './css/cbo-detail.css';

interface IProps {
  CBO: FullCBOFragment | null;
  close: () => void;
  createMode: boolean;
  cancelCreateCBO: () => void;
}

interface IGraphqlProps {
  deleteCBO: (options: { variables: CBODeleteMutationVariables }) => { data: CBODeleteMutation };
}

type allProps = IGraphqlProps & IProps & IInjectedErrorProps;

interface IState {
  deleteMode: boolean;
  loading: boolean;
  cboId: string | null;
}

export class CBODetail extends React.Component<allProps, IState> {
  static getDerivedStateFromProps(nextProps: allProps, prevState: IState) {
    // reset view if clicking between patient lists
    if (prevState.cboId && nextProps.CBO && nextProps.CBO.id !== prevState.cboId) {
      return { deleteMode: false, loading: false, cboId: nextProps.CBO.id };
    } else if (nextProps.CBO && !prevState.cboId) {
      return { cboId: nextProps.CBO.id };
    }
    return null;
  }

  state = { deleteMode: false, loading: false, cboId: null };

  onDelete = async () => {
    const { deleteCBO, CBO, close, openErrorPopup } = this.props;
    if (!CBO) return;

    if (!this.state.loading) {
      this.setState({ loading: true });

      try {
        await deleteCBO({ variables: { CBOId: CBO.id } });
        close();
      } catch (err) {
        openErrorPopup(err.message);
      }

      this.setState({ loading: false });
    }
  };

  render(): JSX.Element | null {
    const { CBO, close, createMode, cancelCreateCBO } = this.props;
    const { deleteMode } = this.state;

    if (!CBO && !createMode) return null;

    const detailBody =
      createMode || !CBO ? (
        <CBOCreate cancelCreateCBO={cancelCreateCBO} />
      ) : deleteMode ? (
        <DeleteWarning
          titleMessageId="CBOs.deleteWarning"
          deleteItem={this.onDelete}
          cancel={() => this.setState({ deleteMode: false })}
          deletedItemHeaderMessageId="CBOs.deleteDetail"
          deletedItemName={CBO.name}
        />
      ) : (
        <CBOEdit CBO={CBO} close={close} deleteCBO={() => this.setState({ deleteMode: true })} />
      );

    return <div className={styles.container}>{detailBody}</div>;
  }
}

export default compose(
  withErrorHandler(),
  graphql(CBODeleteMutationGraphql, {
    name: 'deleteCBO',
    options: {
      refetchQueries: ['getCBOs'],
    },
  }),
)(CBODetail) as React.ComponentClass<IProps>;
