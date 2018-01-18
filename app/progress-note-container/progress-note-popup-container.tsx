import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as progressNoteTemplatesQuery from '../graphql/queries/get-progress-note-templates.graphql';
import * as progressNoteQuery from '../graphql/queries/get-progress-note.graphql';
import {
  getCurrentUserQuery,
  FullProgressNoteFragment,
  FullProgressNoteTemplateFragment,
} from '../graphql/types';
import Spinner from '../shared/library/spinner/spinner';
import * as styles from './css/progress-note-popup.css';
import ProgressNotePopup from './progress-note-popup';

interface IProps {
  currentUser: getCurrentUserQuery['currentUser'];
  close: () => void;
  progressNoteId: string;
  visible: boolean;
  mutate?: any;
}

interface IGraphqlProps {
  progressNoteTemplatesLoading?: boolean;
  progressNoteTemplatesError?: string | null;
  progressNoteTemplates: FullProgressNoteTemplateFragment[];
  progressNoteError?: string | null;
  progressNoteLoading?: boolean;
  progressNote?: FullProgressNoteFragment;
}

type allProps = IProps & IGraphqlProps;

export class ProgressNotePopupContainer extends React.Component<allProps, {}> {
  getContent() {
    const { progressNoteTemplates, progressNote, currentUser, visible, close } = this.props;

    if (!visible) {
      return null;
    }

    if (!progressNote || !progressNoteTemplates) {
      return <Spinner />;
    }
    return (
      <ProgressNotePopup
        currentUser={currentUser}
        close={close}
        progressNote={progressNote}
        progressNoteTemplates={progressNoteTemplates}
      />
    );
  }

  render() {
    const { visible } = this.props;
    const containerStyles = classNames(styles.container, {
      [styles.visible]: visible,
    });
    return <div className={containerStyles}>{this.getContent()}</div>;
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(progressNoteQuery as any, {
    skip: (props: IProps) => !props.progressNoteId,
    options: (props: IProps) => ({
      variables: {
        progressNoteId: props.progressNoteId,
      },
    }),
    props: ({ data }) => ({
      progressNoteLoading: data ? data.loading : false,
      progressNoteError: data ? data.error : null,
      progressNote: data ? (data as any).progressNote : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(progressNoteTemplatesQuery as any, {
    props: ({ data }) => ({
      progressNoteTemplatesLoading: data ? data.loading : false,
      progressNoteTemplatesError: data ? data.error : null,
      progressNoteTemplates: data ? (data as any).progressNoteTemplates : null,
    }),
  }),
)(ProgressNotePopupContainer);
