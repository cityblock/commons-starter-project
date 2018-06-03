import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup as closePopupAction } from '../../actions/popup-action';
import * as patientConcernDeleteMutationGraphql from '../../graphql/queries/patient-concern-delete-mutation.graphql';
import {
  patientConcernDeleteMutation,
  patientConcernDeleteMutationVariables,
} from '../../graphql/types';
import { IPatientConcernDeletePopupOptions } from '../../reducers/popup-reducer';
import DeleteModal from '../../shared/library/delete-modal/delete-modal';
import { IState as IAppState } from '../../store';

interface IProps {
  refetchCarePlan: () => Promise<any>;
}

interface IStateProps {
  visible: boolean;
  patientConcernTitle: string;
  patientConcernId: string;
}

interface IDispatchProps {
  closePopup: () => void;
}

interface IGraphqlProps {
  deletePatientConcern: (
    options: { variables: patientConcernDeleteMutationVariables },
  ) => { data: patientConcernDeleteMutation };
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

interface IState {
  loading: boolean;
  error: string | null;
}

export class DeleteConcernModal extends React.Component<allProps, IState> {
  state = { loading: false, error: null };

  handleClose = () => {
    this.setState({ loading: false, error: null });
    this.props.closePopup();
  };

  onDelete = async () => {
    const { patientConcernId, deletePatientConcern } = this.props;

    if (!this.state.loading) {
      this.setState({ loading: true, error: null });

      try {
        await deletePatientConcern({ variables: { patientConcernId } });
        this.handleClose();
      } catch (err) {
        this.setState({ error: err.message });
      }

      this.setState({ loading: false });
    }
  };

  render(): JSX.Element {
    const { visible, patientConcernTitle } = this.props;
    const { error } = this.state;

    return (
      <DeleteModal
        visible={visible}
        titleMessageId="concernDelete.title"
        descriptionMessageId="concernDelete.description"
        deletedItemHeaderMessageId="concernDelete.name"
        deletedItemName={patientConcernTitle}
        closePopup={this.handleClose}
        deleteItem={this.onDelete}
        error={error}
      />
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const visible = state.popup.name === 'DELETE_PATIENT_CONCERN';
  const options = state.popup.options as IPatientConcernDeletePopupOptions;
  const patientConcernTitle = visible ? options.patientConcernTitle : '';
  const patientConcernId = visible ? options.patientConcernId : '';

  return { visible, patientConcernTitle, patientConcernId };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): IDispatchProps => {
  const closePopup = () => dispatch(closePopupAction());
  return { closePopup };
};

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql<IGraphqlProps, {}, allProps>(patientConcernDeleteMutationGraphql as any, {
    name: 'deletePatientConcern',
  }),
)(DeleteConcernModal) as React.ComponentClass<IProps>;
