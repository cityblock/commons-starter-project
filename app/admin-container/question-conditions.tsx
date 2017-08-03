import * as React from 'react';
import { FullAnswerFragment, FullQuestionConditionFragment } from '../graphql/types';
import * as styles from './css/two-panel-right.css';
import QuestionConditionCreateEdit from './question-condition-create';
import QuestionConditionRow from './question-condition-row';

export interface IProps {
  title: string;
  questionConditions?: FullQuestionConditionFragment[] | null;
  answers: FullAnswerFragment[] | null;
  questionId: string;
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
    const { title, questionConditions, questionId, answers } = this.props;
    const questionConditionsHtml = questionConditions && questionConditions.length ?
      this.renderQuestionConditions(questionConditions) : (<div>no conditions</div>);
    return (
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        {questionConditionsHtml}
        <div className={styles.title}>Create {title}</div>
        <QuestionConditionCreateEdit questionId={questionId} answers={answers} />
      </div>
    );
  }
}

export default QuestionConditions;
