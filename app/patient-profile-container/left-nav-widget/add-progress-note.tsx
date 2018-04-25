import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';
import * as progressNoteCreateMutationGraphql from '../../graphql/queries/progress-note-create.graphql';
import {
  progressNoteCreateMutation,
  progressNoteCreateMutationVariables,
} from '../../graphql/types';
import LeftNavQuickAction from './left-nav-quick-action';

export interface IProps {
  patientId: string;
  onClose: () => void;
}

interface IDispatchProps {
  openProgressNotePopup: (progressNoteId: string) => void;
}

interface IGraphqlProps {
  progressNoteCreate: (
    options: { variables: progressNoteCreateMutationVariables },
  ) => { data: progressNoteCreateMutation };
}

type allProps = IProps & IDispatchProps & IGraphqlProps;

export class AddProgressNote extends React.Component<allProps> {
  showNewProgressNotePopup = async (): Promise<void> => {
    const { progressNoteCreate, openProgressNotePopup, patientId } = this.props;

    const progressNote = await progressNoteCreate({
      variables: { patientId },
    });
    if (progressNote.data.progressNoteCreate) {
      openProgressNotePopup(progressNote.data.progressNoteCreate.id);
    }
    // TODO: Handle error
  };

  render(): JSX.Element {
    const { onClose } = this.props;

    return (
      <LeftNavQuickAction
        quickAction="addProgressNote"
        onClick={this.showNewProgressNotePopup}
        onClose={onClose}
      />
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): IDispatchProps => {
  return {
    openProgressNotePopup: (progressNoteId: string) =>
      dispatch(
        openPopup({
          name: 'PROGRESS_NOTE',
          options: {
            progressNoteId,
          },
        }),
      ),
  };
};

export default compose(
  connect<{}, IDispatchProps, allProps>(null, mapDispatchToProps as any),
  graphql(progressNoteCreateMutationGraphql as any, {
    name: 'progressNoteCreate',
    options: { refetchQueries: ['getProgressNotesForCurrentUser'] },
  }),
)(AddProgressNote) as React.ComponentClass<IProps>;
