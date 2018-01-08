import * as React from 'react';
import { graphql } from 'react-apollo';
import * as progressNoteActivityQuery from '../../graphql/queries/get-progress-note-activity-for-progress-note.graphql';
import {
  getProgressNoteActivityForProgressNoteQuery,
  FullProgressNoteFragment,
} from '../../graphql/types';
import * as styles from './css/progress-note-activity.css';
import ProgressNoteActivitySection from './progress-note-activity-section';

interface IProps {
  patientId: string;
  progressNote?: FullProgressNoteFragment | null;
}

interface IGraphqlProps {
  progressNoteActivity?: getProgressNoteActivityForProgressNoteQuery['progressNoteActivityForProgressNote'];
  progressNoteActivityLoading?: boolean;
  progressNoteActivityError: string | null;
}

type allProps = IProps & IGraphqlProps;

class ProgressNoteActivity extends React.Component<allProps> {
  render() {
    const { progressNoteActivity } = this.props;
    return (
      <div className={styles.activity}>
        <ProgressNoteActivitySection
          activityType={'patientAnswerEvents'}
          progressNoteActivity={progressNoteActivity}
        />
        <ProgressNoteActivitySection
          activityType={'taskEvents'}
          progressNoteActivity={progressNoteActivity}
        />
        <ProgressNoteActivitySection
          activityType={'carePlanUpdateEvents'}
          progressNoteActivity={progressNoteActivity}
        />
        <ProgressNoteActivitySection
          activityType={'quickCallEvents'}
          progressNoteActivity={progressNoteActivity}
        />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(progressNoteActivityQuery as any, {
  skip: (props: IProps) => !props.progressNote,
  options: (props: IProps) => ({
    variables: {
      progressNoteId: props.progressNote!.id,
    },
  }),
  props: ({ data }) => ({
    progressNoteActivityLoading: data ? data.loading : false,
    progressNoteActivityError: data ? data.error : null,
    progressNoteActivity: data ? (data as any).progressNoteActivityForProgressNote : null,
  }),
})(ProgressNoteActivity);
