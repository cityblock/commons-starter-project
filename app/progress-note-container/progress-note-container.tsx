import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { closePopup, openPopup } from '../actions/popup-action';
import * as progressNotesForCurrentUserQuery from '../graphql/queries/get-progress-notes-for-current-user.graphql';
import * as progressNotesForSupervisorReviewQuery from '../graphql/queries/get-progress-notes-for-supervisor-review.graphql';
import {
  getCurrentUserQuery,
  getProgressNotesForCurrentUserQuery,
  getProgressNotesForSupervisorReviewQuery,
} from '../graphql/types';
import { IProgressNotePopupOptions } from '../reducers/popup-reducer';
import Icon from '../shared/library/icon/icon';
import { IState as IAppState } from '../store';
import * as styles from './css/progress-note-container.css';
import ProgressNotesPopupContainer from './progress-note-popup-container';
import { ProgressNoteSmallRow } from './progress-note-small-row';

interface IProps {
  currentUser: getCurrentUserQuery['currentUser'];
}

interface IRouterProps {
  match: {
    params: {
      patientId: string;
    };
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
  popupIsOpen: boolean;
  drawerIsOpen: boolean;
  progressNoteId: string | null;
}

interface IDispatchProps {
  closeProgressNote: () => any;
  openProgressNote: (progressNoteId: string) => any;
  closeProgressNotesDrawer: () => any;
  openProgressNotesDrawer: () => any;
}

type allProps = IProps & IGraphqlProps & IStateProps & IDispatchProps & IRouterProps;

export class ProgressNoteContainer extends React.Component<allProps> {
  constructor(props: allProps) {
    super(props);
    this.state = { drawerIsOpen: false };
  }

  getProgressNotesHtml() {
    const {
      progressNotes,
      progressNotesForSupervisorReview,
      currentUser,
      drawerIsOpen,
    } = this.props;
    const notes = (progressNotesForSupervisorReview || []).concat(progressNotes || []);
    const height = drawerIsOpen && notes ? notes.length * 63 : 0;
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

  render() {
    const {
      progressNotes,
      popupIsOpen,
      progressNoteId,
      progressNotesForSupervisorReview,
      currentUser,
      drawerIsOpen,
      openProgressNotesDrawer,
      closeProgressNotesDrawer,
    } = this.props;
    const progressNotesCount =
      (progressNotes || []).length + (progressNotesForSupervisorReview || []).length;
    const progressNotesHtml = this.getProgressNotesHtml();
    const icon = drawerIsOpen ? (
      <Icon name="expandMore" onClick={closeProgressNotesDrawer} className={styles.icon} />
    ) : (
      <Icon name="expandLess" onClick={openProgressNotesDrawer} className={styles.icon} />
    );
    const topBarAction = drawerIsOpen ? closeProgressNotesDrawer : openProgressNotesDrawer;
    // Hide the popup if no open progress notes
    if (progressNotesCount < 1) {
      return null;
    }
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.topBar} onClick={topBarAction}>
            <FormattedMessage id="progressNote.progressNotes">
              {(message: string) => (
                <div className={styles.text}>
                  {message} ({progressNotesCount})
                </div>
              )}
            </FormattedMessage>
            {icon}
          </div>
          {progressNotesHtml}
        </div>
        <ProgressNotesPopupContainer
          progressNoteId={progressNoteId}
          visible={popupIsOpen}
          currentUser={currentUser}
          close={this.props.closeProgressNote}
        />
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  const popupIsOpen = state.popup.name === 'PROGRESS_NOTE';
  const drawerIsOpen = state.popup.name === 'PROGRESS_NOTES_DRAWER';

  return {
    popupIsOpen,
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
    closeProgressNote: () => dispatch(closePopup()),
  };
}

export default compose(
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
