import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientAnswersQuery from '../../graphql/queries/get-patient-answers.graphql';
import { getPatientAnswersQuery } from '../../graphql/types';
import * as styles from './css/progress-note-row-questions.css';
import { ProgressNoteQuestionAnswer } from './progress-note-question-answer';

interface IProps {
  progressNoteId: string;
  patientId: string;
}

interface IGraphqlProps {
  answers: getPatientAnswersQuery['patientAnswers'];
}

type allProps = IProps & IGraphqlProps;

export class ProgressNoteRowQuestions extends React.Component<allProps> {
  renderAnswers(answers: getPatientAnswersQuery['patientAnswers']) {
    return (answers || []).map(
      answer => (answer ? <ProgressNoteQuestionAnswer key={answer.id} answer={answer} /> : null),
    );
  }

  render() {
    const patientAnswersHtml = this.renderAnswers(this.props.answers);
    return <div className={styles.container}>{patientAnswersHtml}</div>;
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(patientAnswersQuery as any, {
  options: (props: IProps) => ({
    variables: {
      filterId: props.progressNoteId,
      patientId: props.patientId,
      filterType: 'progressNote',
    },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    answers: data ? (data as any).patientAnswers : null,
  }),
})(ProgressNoteRowQuestions);
