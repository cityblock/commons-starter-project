import classNames from 'classnames';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup } from '../actions/popup-action';
import progressNoteTemplatesGraphql from '../graphql/queries/get-progress-note-templates.graphql';
import progressNoteGraphql from '../graphql/queries/get-progress-note.graphql';
import { FullProgressNote, FullProgressNoteTemplate } from '../graphql/types';
import { IProgressNotePopupOptions } from '../reducers/popup-reducer';
import Spinner from '../shared/library/spinner/spinner';
import { IState as IAppState } from '../store';
import styles from './css/progress-note-popup.css';
import ProgressNotePopup from './progress-note-popup';

interface IProps {
  patientId: string;
  glassBreakId: string | null;
}

interface IStateProps {
  visible: boolean;
  progressNoteId: string | null;
}

interface IDispatchProps {
  close: () => void;
}

interface IGraphqlProps {
  progressNoteTemplatesLoading?: boolean;
  progressNoteTemplatesError?: string | null;
  progressNoteTemplates: FullProgressNoteTemplate[];
  progressNoteError?: string | null;
  progressNoteLoading?: boolean;
  progressNote?: FullProgressNote;
}

type allProps = IProps & IStateProps & IDispatchProps & IGraphqlProps;

export class ProgressNotePopupContainer extends React.Component<allProps, {}> {
  getContent() {
    const {
      progressNoteTemplates,
      progressNote,
      visible,
      close,
      patientId,
      glassBreakId,
    } = this.props;

    if (!visible) {
      return null;
    }

    if (!progressNote || !progressNoteTemplates) {
      return <Spinner />;
    }

    if (progressNote.patientId !== patientId) {
      return null;
    }

    return (
      <ProgressNotePopup
        close={close}
        glassBreakId={glassBreakId}
        progressNote={progressNote}
        progressNoteTemplates={progressNoteTemplates}
      />
    );
  }

  render() {
    const { visible, progressNote, patientId } = this.props;
    const containerStyles = classNames(styles.container, {
      [styles.visible]: visible && !!progressNote && progressNote.patientId === patientId,
    });
    return <div className={containerStyles}>{this.getContent()}</div>;
  }
}

function mapStateToProps(state: IAppState): IStateProps {
  const visible = state.popup.name === 'PROGRESS_NOTE';

  return {
    visible,
    progressNoteId: visible
      ? (state.popup.options as IProgressNotePopupOptions).progressNoteId
      : null,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return {
    close: () => dispatch(closePopup()),
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, allProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql(progressNoteGraphql, {
    skip: (props: IStateProps) => !props.progressNoteId,
    options: (props: IStateProps & IProps) => ({
      variables: {
        progressNoteId: props.progressNoteId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      progressNoteLoading: data ? data.loading : false,
      progressNoteError: data ? data.error : null,
      progressNote: data ? (data as any).progressNote : null,
    }),
  }),
  graphql(progressNoteTemplatesGraphql, {
    options: { fetchPolicy: 'network-only' },
    props: ({ data }) => ({
      progressNoteTemplatesLoading: data ? data.loading : false,
      progressNoteTemplatesError: data ? data.error : null,
      progressNoteTemplates: data ? (data as any).progressNoteTemplates : null,
    }),
  }),
)(ProgressNotePopupContainer) as React.ComponentClass<IProps>;
