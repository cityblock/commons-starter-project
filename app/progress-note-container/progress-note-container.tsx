import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { closeProgressNote, openProgressNote } from '../actions/popup-action';
/* tslint:disable:max-line-length */
import * as progressNotesForCurrentUserQuery from '../graphql/queries/get-progress-notes-for-current-user.graphql';
/* tsline:enable:max-line-length */
import { getProgressNotesForCurrentUserQuery } from '../graphql/types';
import Icon from '../shared/library/icon/icon';
import { IState as IAppState } from '../store';
import * as styles from './css/progress-note-container.css';
import ProgressNotesPopup from './progress-note-popup';
import { ProgressNoteSmallRow } from './progress-note-small-row';

interface IProps {
  match: {
    params: {
      patientId: string;
    };
  };
}

interface IGraphqlProps {
  progressNotes: getProgressNotesForCurrentUserQuery['progressNotesForCurrentUser'];
  progressNotesLoading?: boolean;
  progressNotesError?: string;
}

interface IStateProps {
  popupIsOpen: boolean;
  popupPatientId?: string;
}

interface IDispatchProps {
  closeProgressNote: () => any;
  openProgressNote: (patientId: string) => any;
}

type allProps = IProps & IGraphqlProps & IStateProps & IDispatchProps;

interface IState {
  drawerIsOpen: boolean;
}

export class ProgressNoteContainer extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = { drawerIsOpen: false };
  }

  showHideList = () => {
    const { drawerIsOpen } = this.state;
    this.setState({ drawerIsOpen: !drawerIsOpen });
  };

  getProgressNotesHtml() {
    const { drawerIsOpen } = this.state;
    if (!drawerIsOpen) {
      return null;
    }
    const { progressNotes } = this.props;
    const progressNotesHtml = (progressNotes || []).map(
      progressNote =>
        progressNote ? (
          <ProgressNoteSmallRow
            key={progressNote.id}
            progressNote={progressNote}
            onClick={this.props.openProgressNote}
          />
        ) : null,
    );
    return <div className={styles.progressNotes}>{progressNotesHtml}</div>;
  }

  render() {
    const { progressNotes, popupIsOpen, popupPatientId } = this.props;
    const { drawerIsOpen } = this.state;
    const progressNotesCount = (progressNotes || []).length;
    const progressNotesHtml = this.getProgressNotesHtml();
    const icon = drawerIsOpen ? (
      <Icon name="expandMore" onClick={this.showHideList} className={styles.icon} />
    ) : (
      <Icon name="expandLess" onClick={this.showHideList} className={styles.icon} />
    );
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.topBar} onClick={this.showHideList}>
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
        <ProgressNotesPopup
          patientId={popupPatientId}
          visible={popupIsOpen}
          close={this.props.closeProgressNote}
        />
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    popupIsOpen: state.popup.progressNoteOpen,
    popupPatientId: state.popup.patientId,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): IDispatchProps {
  return {
    openProgressNote: (patientId: string) => dispatch(openProgressNote(patientId)),
    closeProgressNote: () => dispatch(closeProgressNote()),
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, allProps>(mapStateToProps as any, mapDispatchToProps),
  graphql<IGraphqlProps, {}, allProps>(progressNotesForCurrentUserQuery as any, {
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
)(ProgressNoteContainer);
