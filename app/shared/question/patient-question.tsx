import * as classNames from 'classnames';
import * as React from 'react';
import { FullQuestionFragment } from '../../graphql/types';
import * as styles from './patient-question.css';
import QuestionAnswers from './question-answers';

interface IProps {
  onChange: (questionId: string, answerId: string, value: string | number) => any;
  visible: boolean;
  question: FullQuestionFragment;
  editable: boolean;
  answerData: {
    answers: Array<{
      id: string;
      value: string;
    }>;
    oldAnswers: Array<{
      id: string;
      value: string;
    }>;
    changed: boolean;
  };
}

export default class PatientQuestion extends React.Component<IProps, {}> {
  updateValue = (value: string | number, answerId: string) => {
    const { question, onChange, editable } = this.props;

    if (editable) {
      onChange(question.id, answerId, value);
    }
  };

  renderAnswers = () => {
    const { question, answerData, onChange, editable } = this.props;

    return (
      <QuestionAnswers
        question={question}
        answerData={answerData}
        onChange={onChange}
        editable={editable}
      />
    );
  };

  render() {
    const { question, editable, answerData, visible } = this.props;

    let highRiskAnswer: boolean = false;

    if (question.answers && answerData && answerData.answers) {
      const answerIds = answerData.answers.map(answer => answer.id);
      const riskTypes = question.answers
        .filter(answer => answerIds.indexOf(answer.id) > -1)
        .map(answer => answer.riskAdjustmentType);

      if (riskTypes.some(riskType => riskType === 'forceHighRisk')) {
        highRiskAnswer = true;
      }
    }

    const questionStyles = classNames(styles.question, {
      [styles.disabled]: !editable,
      [styles.highRiskAnswer]: highRiskAnswer,
      [styles.hidden]: !visible,
    });

    return (
      <div className={questionStyles}>
        <div className={styles.questionHeader}>
          <div className={styles.questionTitle}>{question.title}</div>
          <div className={styles.questionHamburger} />
        </div>
        {this.renderAnswers()}
      </div>
    );
  }
}
