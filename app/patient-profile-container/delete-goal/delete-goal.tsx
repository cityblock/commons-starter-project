import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup as closePopupAction } from '../../actions/popup-action';
import * as patientGoalDeleteMutationGraphql from '../../graphql/queries/patient-goal-delete-mutation.graphql';
import { patientGoalDeleteMutation, patientGoalDeleteMutationVariables } from '../../graphql/types';
import { IPatientGoalDeletePopupOptions } from '../../reducers/popup-reducer';
import DeleteModal from '../../shared/library/delete-modal/delete-modal';
import { IState as IAppState } from '../../store';

interface IProps {
  refetchCarePlan: () => Promise<any>;
}

interface IStateProps {
  visible: boolean;
  patientGoalTitle: string;
  patientGoalId: string;
}

interface IDispatchProps {
  closePopup: () => void;
}

interface IGraphqlProps {
  deletePatientGoal: (
    options: { variables: patientGoalDeleteMutationVariables },
  ) => { data: patientGoalDeleteMutation };
}

type allProps = IProps & IStateProps & IDispatchProps & IGraphqlProps;

interface IState {
  loading: boolean;
  error: string | null;
}

export class DeleteGoalModal extends React.Component<allProps, IState> {
  state = { loading: false, error: null };

  onDelete = async () => {
    const { patientGoalId, deletePatientGoal, closePopup, refetchCarePlan } = this.props;

    if (!this.state.loading) {
      this.setState({ loading: true, error: null });

      try {
        await deletePatientGoal({ variables: { patientGoalId } });
        await refetchCarePlan();
        closePopup();
      } catch (err) {
        this.setState({ error: err.message });
      }

      this.setState({ loading: false });
    }
  };

  render(): JSX.Element {
    const { visible, patientGoalTitle, closePopup } = this.props;
    const { error } = this.state;

    return (
      <DeleteModal
        visible={visible}
        titleMessageId="goalDelete.title"
        descriptionMessageId="goalDelete.description"
        deletedItemHeaderMessageId="goalDelete.name"
        deletedItemName={patientGoalTitle}
        closePopup={closePopup}
        deleteItem={this.onDelete}
        error={error}
      />
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const visible = state.popup.name === 'DELETE_PATIENT_GOAL';
  const options = state.popup.options as IPatientGoalDeletePopupOptions;
  const patientGoalTitle = visible ? options.patientGoalTitle : '';
  const patientGoalId = visible ? options.patientGoalId : '';

  return { visible, patientGoalTitle, patientGoalId };
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
  graphql<IGraphqlProps, {}, allProps>(patientGoalDeleteMutationGraphql as any, {
    name: 'deletePatientGoal',
  }),
)(DeleteGoalModal) as React.ComponentClass<IProps>;
