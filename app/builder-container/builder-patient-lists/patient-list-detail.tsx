import { isEqual } from 'lodash';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import patientListDeleteMutationGraphql from '../../graphql/queries/patient-list-delete-mutation.graphql';
import {
  patientListDeleteMutation,
  patientListDeleteMutationVariables,
  FullPatientListFragment,
} from '../../graphql/types';
import DeleteWarning from '../../shared/library/delete-warning/delete-warning';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../shared/with-error-handler/with-error-handler';
import styles from './css/patient-list-detail.css';
import PatientListCreate from './patient-list-create';
import PatientListEdit from './patient-list-edit';

interface IProps {
  patientList: FullPatientListFragment | null;
  close: () => void;
  createMode: boolean;
  cancelCreatePatientList: () => void;
}

interface IGraphqlProps {
  deletePatientList: (
    options: { variables: patientListDeleteMutationVariables },
  ) => { data: patientListDeleteMutation };
}

type allProps = IGraphqlProps & IProps & IInjectedErrorProps;

interface IState {
  deleteMode: boolean;
  loading: boolean;
  patientListId: string | null;
}

export class PatientListDetail extends React.Component<allProps, IState> {
  static getDerivedStateFromProps(nextProps: allProps, prevState: IState) {
    // reset view if clicking between patient lists
    if (nextProps.patientList && !isEqual(nextProps.patientList.id, prevState.patientListId)) {
      return { deleteMode: false, loading: false, patientListId: nextProps.patientList.id };
    }
    return null;
  }

  state = { deleteMode: false, loading: false, patientListId: null };

  onDelete = async () => {
    const { deletePatientList, patientList, close, openErrorPopup } = this.props;
    if (!patientList) return;

    if (!this.state.loading) {
      this.setState({ loading: true });

      try {
        await deletePatientList({ variables: { patientListId: patientList.id } });
        close();
      } catch (err) {
        openErrorPopup(err.message);
      }

      this.setState({ loading: false });
    }
  };

  render(): JSX.Element | null {
    const { patientList, close, createMode, cancelCreatePatientList } = this.props;
    const { deleteMode } = this.state;

    if (!patientList && !createMode) return null;

    const detailBody =
      createMode || !patientList ? (
        <PatientListCreate cancelCreatePatientList={cancelCreatePatientList} />
      ) : deleteMode ? (
        <DeleteWarning
          titleMessageId="patientLists.deleteWarning"
          deleteItem={this.onDelete}
          cancel={() => this.setState({ deleteMode: false })}
          deletedItemHeaderMessageId="patientLists.deleteDetail"
          deletedItemName={patientList.title}
        />
      ) : (
        <PatientListEdit
          patientList={patientList}
          close={close}
          deletePatientList={() => this.setState({ deleteMode: true })}
        />
      );

    return <div className={styles.container}>{detailBody}</div>;
  }
}

export default compose(
  withErrorHandler(),
  graphql(patientListDeleteMutationGraphql, {
    name: 'deletePatientList',
    options: {
      refetchQueries: ['getPatientLists'],
    },
  }),
)(PatientListDetail) as React.ComponentClass<IProps>;
