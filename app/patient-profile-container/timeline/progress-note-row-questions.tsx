import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientAnswersQuery from '../../graphql/queries/get-patient-answers.graphql';
import * as progressNoteActivityQuery from '../../graphql/queries/get-progress-note-activity-for-progress-note.graphql';
import {
  getPatientAnswersQuery,
  getProgressNoteActivityForProgressNoteQuery,
  FullProgressNoteFragment,
} from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/progress-note-row-questions.css';
import { ProgressNoteQuestionAnswer } from './progress-note-question-answer';

interface IProps {
  progressNote: FullProgressNoteFragment;
  patientId: string;
  goToActivityTab: () => void;
}

interface IGraphqlProps {
  answers: getPatientAnswersQuery['patientAnswers'];
  progressNoteActivity?: getProgressNoteActivityForProgressNoteQuery['progressNoteActivityForProgressNote'];
  progressNoteActivityLoading?: boolean;
  progressNoteActivityError: string | null;
}

type allProps = IProps & IGraphqlProps;

export class ProgressNoteRowQuestions extends React.Component<allProps> {
  renderAnswers(answers: getPatientAnswersQuery['patientAnswers']) {
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
    return (
      <div className={styles.container}>
        {patientAnswersHtml}
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
        </div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(progressNoteActivityQuery as any, {
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
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersQuery as any, {
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
)(ProgressNoteRowQuestions);
