import React from 'react';
import { FullAnswer, FullQuestion, FullQuestionCondition } from '../graphql/types';
import styles from '../shared/css/two-panel-right.css';
import QuestionConditionCreate from './question-condition-create';
import QuestionConditionRow from './question-condition-row';

interface IProps {
  questions: FullQuestion[];
  questionConditions?: FullQuestionCondition[] | null;
  questionId: string;
}

function getAnswersForQuestions(questions: FullQuestion[], questionId: string) {
  let answers: FullAnswer[] = [];
  (questions || []).filter(question => question.id !== questionId).forEach(question => {
    if (question.answers) {
      answers = answers.concat(question.answers);
    }
  });
  return answers;
}

class QuestionConditions extends React.Component<IProps> {
  renderQuestionConditions(questionConditions: FullQuestionCondition[]) {
    return questionConditions.map(questionCondition => (
      <QuestionConditionRow key={questionCondition.id} questionCondition={questionCondition} />
    ));
  }

  render() {
    const { questionConditions, questionId, questions } = this.props;
    const questionConditionsHtml =
      questionConditions && questionConditions.length ? (
        this.renderQuestionConditions(questionConditions)
      ) : (
        <div>no applicable if conditions</div>
      );
    const answers = getAnswersForQuestions(questions, questionId);
    return (
      <div>
        <div className={styles.smallText}>Applicable if conditions</div>
        <br />
        {questionConditionsHtml}
        <br />
        <QuestionConditionCreate questionId={questionId} answers={answers} />
      </div>
    );
  }
}

export default QuestionConditions;
