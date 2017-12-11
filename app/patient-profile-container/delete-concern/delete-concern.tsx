import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup as closePopupAction } from '../../actions/popup-action';
/* tslint:disable:max-line-length */
import * as patientConcernDeleteMutationGraphql from '../../graphql/queries/patient-concern-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  patientConcernDeleteMutation,
  patientConcernDeleteMutationVariables,
} from '../../graphql/types';
import { IPatientConcernDeletePopupOptions } from '../../reducers/popup-reducer';
import DeleteModal from '../../shared/library/delete-modal/delete-modal';
import { IState as IAppState } from '../../store';

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
  constructor(props: allProps) {
    super(props);
    this.state = { loading: false, error: null };
  }

  onDelete = async () => {
    const { patientConcernId, deletePatientConcern, closePopup } = this.props;

    if (!this.state.loading) {
      this.setState({ loading: true, error: null });

      try {
        await deletePatientConcern({ variables: { patientConcernId } });
        closePopup();
      } catch (err) {
        this.setState({ error: err.message });
      }

      this.setState({ loading: false });
    }
  };

  render(): JSX.Element {
    const { visible, patientConcernTitle, closePopup } = this.props;

    return (
      <DeleteModal
        visible={visible}
        titleMessageId="concernDelete.title"
        descriptionMessageId="concernDelete.description"
        deletedItemHeaderMessageId="concernDelete.name"
        deletedItemName={patientConcernTitle}
        closePopup={closePopup}
        deleteItem={this.onDelete}
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

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => {
  const closePopup = () => dispatch(closePopupAction());
  return { closePopup };
};

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, {}, allProps>(patientConcernDeleteMutationGraphql as any, {
    name: 'deletePatientConcern',
    options: {
      refetchQueries: ['getPatientCarePlan'],
    },
  }),
)(DeleteConcernModal);
