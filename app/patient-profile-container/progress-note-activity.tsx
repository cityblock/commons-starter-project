import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as progressNoteActivityQuery from '../graphql/queries/get-progress-note-activity-for-progress-note.graphql';
/* tslint:enable:max-line-length */
import { FullProgressNoteActivityFragment, FullProgressNoteFragment } from '../graphql/types';
// import * as styles from './css/progress-note-popup.css';

interface IProps {
  patientId: string;
  progressNote?: FullProgressNoteFragment | null;
}

interface IGraphqlProps {
  progressNoteActivity?: FullProgressNoteActivityFragment;
  progressNoteActivityLoading?: boolean;
  progressNoteActivityError?: string;
}

type allProps = IProps & IGraphqlProps;

class ProgressNoteActivity extends React.Component<allProps> {
  render() {
    return <div />;
  }
}

export default compose(
  graphql<IGraphqlProps, IProps>(progressNoteActivityQuery as any, {
    skip: (props: IProps) => !props.progressNote,
    options: (props: IProps) => ({
      variables: {
        progressNoteId: props.progressNote!.id,
      },
    }),
    props: ({ data }) => ({
      progressNoteActivityLoading: data ? data.loading : false,
      progressNoteActivityError: data ? data.error : null,
      progressNoteActivity: data ? (data as any).patient : null,
    }),
  }),
)(ProgressNoteActivity);
