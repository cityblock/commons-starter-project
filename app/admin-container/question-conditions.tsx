import * as React from 'react';
import {
  FullAnswerFragment,
  FullQuestionConditionFragment,
  FullQuestionFragment,
} from '../graphql/types';
import * as styles from './css/two-panel-right.css';
import QuestionConditionCreate from './question-condition-create';
import QuestionConditionRow from './question-condition-row';

export interface IProps {
  questions: FullQuestionFragment[];
  questionConditions?: FullQuestionConditionFragment[] | null;
  questionId: string;
}

function getAnswersForQuestions(questions: FullQuestionFragment[], questionId: string) {
  let answers: FullAnswerFragment[] = [];
  (questions || [])
    .filter(question => question.id !== questionId)
    .forEach(question => {
      if (question.answers) {
        answers = answers.concat(question.answers);
      }
    });
  return answers;
}

class QuestionConditions extends React.Component<IProps> {

  renderQuestionConditions(questionConditions: FullQuestionConditionFragment[]) {
    return questionConditions.map(questionCondition => (
      <QuestionConditionRow
        key={questionCondition.id}
        questionCondition={questionCondition} />
    ));
  }

  render() {
    const { questionConditions, questionId, questions } = this.props;
    const questionConditionsHtml = questionConditions && questionConditions.length ?
      this.renderQuestionConditions(questionConditions) : (<div>no applicable if conditions</div>);
    const answers = getAnswersForQuestions(questions, questionId);
    return (
      <div>
        <div className={styles.smallText}>Applicable if conditions</div>
        <br />
        {questionConditionsHtml}
        <br />
        <div className={styles.smallText}>Create applicable if conditions</div>
        <QuestionConditionCreate questionId={questionId} answers={answers} />
      </div>
    );
  }
}

export default QuestionConditions;
