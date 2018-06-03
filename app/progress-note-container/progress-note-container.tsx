import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { closePopup, openPopup } from '../actions/popup-action';
import * as progressNotesForCurrentUserQuery from '../graphql/queries/get-progress-notes-for-current-user.graphql';
import * as progressNotesForSupervisorReviewQuery from '../graphql/queries/get-progress-notes-for-supervisor-review.graphql';
import {
  getCurrentUserQuery,
  getProgressNotesForCurrentUserQuery,
  getProgressNotesForSupervisorReviewQuery,
} from '../graphql/types';
import { IProgressNotePopupOptions } from '../reducers/popup-reducer';
import { IState as IAppState } from '../store';
import * as styles from './css/progress-note-container.css';
import ProgressNoteSmallRow from './progress-note-small-row';

const PROGRESS_NOTE_HIDE_ROUTES = ['builder', 'contacts', 'manager', 'voicemails'];

interface IProps {
  currentUser: getCurrentUserQuery['currentUser'];
}

interface IRouterProps {
  location: {
    pathname: string;
  };
}

interface IGraphqlProps {
  progressNotes: getProgressNotesForCurrentUserQuery['progressNotesForCurrentUser'];
  progressNotesLoading?: boolean;
  progressNotesError: string | null;
  progressNotesForSupervisorReview: getProgressNotesForSupervisorReviewQuery['progressNotesForSupervisorReview'];
  progressNotesForSupervisorReviewLoading?: boolean;
  progressNotesForSupervisorReviewError: string | null;
}

export interface IStateProps {
  drawerIsOpen: boolean;
  progressNoteId: string | null;
}

interface IDispatchProps {
  openProgressNote: (progressNoteId: string) => void;
  closeProgressNotesDrawer: () => void;
  openProgressNotesDrawer: () => void;
}

type allProps = IProps & IGraphqlProps & IStateProps & IDispatchProps & IRouterProps;

export class ProgressNoteContainer extends React.Component<allProps> {
  state = { drawerIsOpen: false };

  getProgressNotesHtml() {
    const {
      progressNotes,
      progressNotesForSupervisorReview,
      currentUser,
      drawerIsOpen,
    } = this.props;
    const notes = (progressNotesForSupervisorReview || []).concat(progressNotes || []);
    const height = drawerIsOpen && notes ? notes.length * 61 : 0;
    const currentUserId = currentUser ? currentUser.id : '';
    const progressNotesHtml = notes.map(
      progressNote =>
        progressNote ? (
          <ProgressNoteSmallRow
            key={progressNote.id}
            progressNote={progressNote}
            onClick={this.props.openProgressNote}
            currentUserId={currentUserId}
          />
        ) : null,
    );
    return (
      <div style={{ height: `${height}px` }} className={styles.progressNotes}>
        {progressNotesHtml}
      </div>
    );
  }

  isOnProgressNoteHideRoute() {
    const { location } = this.props;
    if (PROGRESS_NOTE_HIDE_ROUTES.indexOf(location.pathname.split('/')[1]) > -1) {
      return true;
    }
    return false;
  }

  render() {
    const {
      progressNotes,
      progressNotesForSupervisorReview,
      drawerIsOpen,
      openProgressNotesDrawer,
      closeProgressNotesDrawer,
    } = this.props;

    const progressNotesCount =
      (progressNotes || []).length + (progressNotesForSupervisorReview || []).length;
    const progressNotesHtml = this.getProgressNotesHtml();
    const topBarAction = drawerIsOpen ? closeProgressNotesDrawer : openProgressNotesDrawer;
    // Hide the popup if no open progress notes
    if (progressNotesCount < 1) {
      return null;
    }
    // Hide the popup if you are on a 'progress note hide' route
    if (this.isOnProgressNoteHideRoute()) {
      return null;
    }

    return (
      <div className={styles.container}>
        <div className={styles.topBar} onClick={topBarAction}>
          <div className={styles.count}>{progressNotesCount}</div>
          <div className={styles.text}>{progressNotesCount > 1 ? 'notes' : 'note'}</div>
        </div>
        {progressNotesHtml}
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  const popupIsOpen = state.popup.name === 'PROGRESS_NOTE';
  const drawerIsOpen = state.popup.name === 'PROGRESS_NOTES_DRAWER';

  return {
    drawerIsOpen,
    progressNoteId: popupIsOpen
      ? (state.popup.options as IProgressNotePopupOptions).progressNoteId
      : null,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return {
    openProgressNotesDrawer: () =>
      dispatch(
        openPopup({
          name: 'PROGRESS_NOTES_DRAWER',
          options: {},
        }),
      ),
    closeProgressNotesDrawer: () => dispatch(closePopup()),
    openProgressNote: (progressNoteId: string) =>
      dispatch(
        openPopup({
          name: 'PROGRESS_NOTE',
          options: {
            progressNoteId,
          },
        }),
      ),
  };
}

export default compose(
  withRouter,
  connect<IStateProps, IDispatchProps, allProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql(progressNotesForCurrentUserQuery as any, {
    options: () => ({
      variables: {
        completed: false,
      },
    }),
    props: ({ data }) => ({
      progressNotesLoading: data ? data.loading : false,
      progressNotesError: data ? data.error : null,
      progressNotes: data ? (data as any).progressNotesForCurrentUser : null,
      refetchProgressNotes: data ? data.refetch : null,
    }),
  }),
  graphql(progressNotesForSupervisorReviewQuery as any, {
    props: ({ data }) => ({
      progressNotesForSupervisorReviewLoading: data ? data.loading : false,
      progressNotesForSupervisorReviewError: data ? data.error : null,
      progressNotesForSupervisorReview: data
        ? (data as any).progressNotesForSupervisorReview
        : null,
      refetchProgressNotes: data ? data.refetch : null,
    }),
  }),
)(ProgressNoteContainer) as React.ComponentClass<IProps>;
