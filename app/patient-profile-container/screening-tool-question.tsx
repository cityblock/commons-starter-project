import * as classNames from 'classnames';
import * as React from 'react';
import { FullQuestionFragment } from '../graphql/types';
import * as styles from './css/risk-areas.css';
import QuestionAnswers from './question-answers';

interface IProps {
  onChange: (questionId: string, answerId: string, value: string | number) => any;
  visible: boolean;
  question: FullQuestionFragment;
  answerData: {
    answers: Array<{
      id: string;
      value: string;
    }>;
  };
}

export default class ScreeningToolQuestion extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderAnswers = this.renderAnswers.bind(this);
    this.calculateHighRisk = this.calculateHighRisk.bind(this);
  }

  updateValue(value: string | number, answerId: string) {
    const { question, onChange } = this.props;

    onChange(question.id, answerId, value);
  }

  renderAnswers() {
    const { question, answerData, onChange } = this.props;

    return <QuestionAnswers question={question} answerData={answerData} onChange={onChange} />;
  }

  calculateHighRisk() {
    const { question, answerData } = this.props;

    if (question.answers && answerData && answerData.answers) {
      const answerIds = answerData.answers.map(answer => answer.id);
      const riskTypes = question.answers
        .filter(answer => answerIds.indexOf(answer.id) > -1)
        .map(answer => answer.riskAdjustmentType);

      if (riskTypes.some(riskType => riskType === 'forceHighRisk')) {
        return true;
      }
    }

    return false;
  }

  render() {
    const { question, visible } = this.props;

    const highRiskAnswer: boolean = this.calculateHighRisk();

    const questionStyles = classNames(styles.riskAssessmentQuestion, {
      [styles.highRiskAnswer]: highRiskAnswer,
      [styles.hidden]: !visible,
    });

    return (
      <div className={questionStyles}>
        <div className={styles.riskAssessmentQuestionHeader}>
          <div className={styles.riskAssessmentQuestionTitle}>{question.title}</div>
          <div className={styles.riskAssessmentQuestionHamburger}></div>
        </div>
        {this.renderAnswers()}
      </div>
    );
  }
}
