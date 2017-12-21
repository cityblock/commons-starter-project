import * as classNames from 'classnames';
import * as React from 'react';
import { FullQuestionFragment } from '../../graphql/types';
import * as styles from './patient-question.css';
import QuestionAnswers from './question-answers';
import QuestionMenu from './question-menu';

interface IProps {
  onChange: (
    questionId: string,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => any;
  visible: boolean;
  question: FullQuestionFragment;
  editable: boolean;
  displayHamburger: boolean;
  answerData: Array<{
    id: string;
    value: string;
  }>;
  patientAnswerIds?: string[];
}

export default class PatientQuestion extends React.Component<IProps, {}> {
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
    const {
      question,
      editable,
      answerData,
      visible,
      displayHamburger,
      patientAnswerIds,
    } = this.props;

    let highRiskAnswer: boolean = false;

    if (question.answers && answerData) {
      const answerIds = answerData.map(answer => answer.id);
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

    const hamburger = displayHamburger ? (
      <QuestionMenu patientAnswerIds={patientAnswerIds || []} questionId={question.id} />
    ) : null;

    return (
      <div className={questionStyles}>
        <div className={styles.questionHeader}>
          <div className={styles.questionTitle}>{question.title}</div>
          {hamburger}
        </div>
        {this.renderAnswers()}
      </div>
    );
  }
}
