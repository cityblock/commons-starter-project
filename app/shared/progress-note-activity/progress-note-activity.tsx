import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import progressNoteActivityGraphql from '../../graphql/queries/get-progress-note-activity-for-progress-note.graphql';
import { getProgressNoteActivityForProgressNote, FullProgressNote } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import styles from './css/progress-note-activity.css';
import ProgressNoteActivitySection from './progress-note-activity-section';

interface IProps {
  progressNote?: FullProgressNote | null;
}

interface IGraphqlProps {
  progressNoteActivity?: getProgressNoteActivityForProgressNote['progressNoteActivityForProgressNote'];
  loading: boolean;
  error: ApolloError | null | undefined;
}

type allProps = IProps & IGraphqlProps;

class ProgressNoteActivity extends React.Component<allProps> {
  render() {
    const { progressNoteActivity, loading } = this.props;
    const count = progressNoteActivity
      ? progressNoteActivity.carePlanUpdateEvents.length +
        progressNoteActivity.patientAnswerEvents.length +
        progressNoteActivity.patientScreeningToolSubmissions.length +
        progressNoteActivity.quickCallEvents.length +
        progressNoteActivity.taskEvents.length
      : 0;
    if (loading) {
      return (
        <div className={styles.empty}>
          <Spinner />
        </div>
      );
    } else if (count < 1) {
      return (
        <div className={styles.activity}>
          <FormattedMessage id="progressNote.emptyEvents">
            {(message: string) => <div className={styles.empty}>{message}</div>}
          </FormattedMessage>
        </div>
      );
    }
    return (
      <div className={styles.activity}>
        <ProgressNoteActivitySection
          activityType="patientAnswerEvents"
          progressNoteActivity={progressNoteActivity}
        />
        <ProgressNoteActivitySection
          activityType="taskEvents"
          progressNoteActivity={progressNoteActivity}
        />
        <ProgressNoteActivitySection
          activityType="carePlanUpdateEvents"
          progressNoteActivity={progressNoteActivity}
        />
        <ProgressNoteActivitySection
          activityType="quickCallEvents"
          progressNoteActivity={progressNoteActivity}
        />
        <ProgressNoteActivitySection
          activityType="patientScreeningToolSubmissions"
          progressNoteActivity={progressNoteActivity}
        />
      </div>
    );
  }
}

export default graphql(progressNoteActivityGraphql, {
  skip: (props: IProps) => !props.progressNote,
  options: (props: IProps) => ({
    variables: {
      progressNoteId: props.progressNote!.id,
    },
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    progressNoteActivity: data ? (data as any).progressNoteActivityForProgressNote : null,
  }),
})(ProgressNoteActivity);
