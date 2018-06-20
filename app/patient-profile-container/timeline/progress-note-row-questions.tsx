import React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import patientAnswersGraphql from '../../graphql/queries/get-patient-answers.graphql';
import progressNoteActivityGraphql from '../../graphql/queries/get-progress-note-activity-for-progress-note.graphql';
import {
  getPatientAnswers,
  getProgressNoteActivityForProgressNote,
  FullProgressNote,
} from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import styles from './css/progress-note-row-questions.css';
import { ProgressNoteQuestionAnswer } from './progress-note-question-answer';

interface IProps {
  progressNote: FullProgressNote;
  patientId: string;
  goToActivityTab: () => void;
}

interface IGraphqlProps {
  answers: getPatientAnswers['patientAnswers'];
  progressNoteActivity?: getProgressNoteActivityForProgressNote['progressNoteActivityForProgressNote'];
  progressNoteActivityLoading?: boolean;
  progressNoteActivityError: string | null;
}

type allProps = IProps & IGraphqlProps;

export class ProgressNoteRowQuestions extends React.Component<allProps> {
  renderAnswers(answers: getPatientAnswers['patientAnswers']) {
    return (answers || []).map(
      answer => (answer ? <ProgressNoteQuestionAnswer key={answer.id} answer={answer} /> : null),
    );
  }

  render() {
    const { progressNote, progressNoteActivity, goToActivityTab } = this.props;
    const patientAnswersHtml = this.renderAnswers(this.props.answers);
    const numberCarePlanUpdates = progressNoteActivity
      ? progressNoteActivity.carePlanUpdateEvents.length
      : 0;
    const activityLinkHtml =
      numberCarePlanUpdates > 0 ? (
        <div className={styles.linkToActivity} onClick={goToActivityTab}>
          <FormattedMessage id="progressNote.numberMapUpdates">
            {(message: string) => (
              <div className={styles.activityLeft}>
                <b>{numberCarePlanUpdates} </b>
                <span>{message}</span>
              </div>
            )}
          </FormattedMessage>
          <FormattedMessage id="progressNote.goToActivity">
            {(message: string) => (
              <div className={styles.activityRight}>
                <span>{message}</span>
                <Icon name={'keyboardArrowRight'} />
              </div>
            )}
          </FormattedMessage>
        </div>
      ) : null;

    return (
      <div className={styles.container}>
        <div className={styles.answers}>{patientAnswersHtml}</div>
        <div>
          <div className={styles.largeSection}>
            <FormattedMessage id="progressNote.memberConcernAndObservation">
              {(message: string) => <div className={styles.heading}>{message}</div>}
            </FormattedMessage>
            <div className={styles.body}>{progressNote.memberConcern}</div>
          </div>
          <div className={styles.largeSection}>
            <FormattedMessage id="progressNote.contextAndPlan">
              {(message: string) => <div className={styles.heading}>{message}</div>}
            </FormattedMessage>
            <div className={styles.body}>{progressNote.summary}</div>
            {activityLinkHtml}
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(progressNoteActivityGraphql, {
    skip: (props: IProps) => !props.progressNote,
    options: (props: IProps) => ({
      variables: {
        progressNoteId: props.progressNote.id,
      },
    }),
    props: ({ data }) => ({
      progressNoteActivityLoading: data ? data.loading : false,
      progressNoteActivityError: data ? data.error : null,
      progressNoteActivity: data ? (data as any).progressNoteActivityForProgressNote : null,
    }),
  }),
  graphql(patientAnswersGraphql, {
    options: (props: IProps) => ({
      variables: {
        filterId: props.progressNote.id,
        patientId: props.patientId,
        filterType: 'progressNote',
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      answers: data ? (data as any).patientAnswers : null,
    }),
  }),
)(ProgressNoteRowQuestions) as React.ComponentClass<IProps>;
