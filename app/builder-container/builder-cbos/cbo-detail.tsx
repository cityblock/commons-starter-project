import { isEqual } from 'lodash-es';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as CBODeleteMutationGraphql from '../../graphql/queries/cbo-delete-mutation.graphql';
import {
  CBODeleteMutation,
  CBODeleteMutationVariables,
  FullCBOFragment,
} from '../../graphql/types';
import DeleteWarning from '../../shared/library/delete-warning/delete-warning';
import CBOCreate from './cbo-create';
import CBOEdit from './cbo-edit';
import * as styles from './css/cbo-detail.css';

interface IProps {
  CBO: FullCBOFragment | null;
  close: () => void;
  createMode: boolean;
  cancelCreateCBO: () => void;
}

interface IGraphqlProps {
  deleteCBO: (options: { variables: CBODeleteMutationVariables }) => { data: CBODeleteMutation };
}

type allProps = IGraphqlProps & IProps;

interface IState {
  deleteMode: boolean;
  loading: boolean;
  error: string | null;
}

export class CBODetail extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState(): IState {
    return { deleteMode: false, loading: false, error: null };
  }

  componentWillReceiveProps(nextProps: allProps) {
    // reset view if clicking between patient lists
    if (!isEqual(this.props.CBO, nextProps.CBO)) {
      this.setState(this.getInitialState());
    }
  }

  onDelete = async () => {
    const { deleteCBO, CBO, close } = this.props;
    if (!CBO) return;

    if (!this.state.loading) {
      this.setState({ loading: true, error: null });

      try {
        await deleteCBO({ variables: { CBOId: CBO.id } });
        close();
      } catch (err) {
        this.setState({ error: err.message });
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

export default graphql<IGraphqlProps, IProps, allProps>(CBODeleteMutationGraphql as any, {
  name: 'deleteCBO',
  options: {
    refetchQueries: ['getCBOs'],
  },
})(CBODetail);
