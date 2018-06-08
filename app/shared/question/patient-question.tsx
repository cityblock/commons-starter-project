import * as classNames from 'classnames';
import * as React from 'react';
import { FullQuestionFragment } from '../../graphql/types';
import FormLabel from '../../shared/library/form-label/form-label';
import * as styles from './patient-question.css';
import QuestionAnswers from './question-answers';
import QuestionMenu from './question-menu';

interface IProps {
  onChange: (
    question: FullQuestionFragment,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => Promise<any>;
  onEditableChange?: () => any;
  visible: boolean;
  question: FullQuestionFragment;
  editable: boolean;
  displayHamburger: boolean;
  answerData: Array<{
    id: string;
    value: string;
  }>;
  patientAnswerIds?: string[];
  assessment?: boolean; // indicates viewing an assessment
}

export default class PatientQuestion extends React.Component<IProps, {}> {
  onClickAnswer = () => {
    const { onEditableChange } = this.props;
    if (onEditableChange && !this.props.editable) {
      onEditableChange();
    }
  };

  renderAnswers = () => {
    const { question, answerData, onChange, editable } = this.props;

    return (
      <div className={styles.answerContainer} onClick={this.onClickAnswer}>
        <QuestionAnswers
          question={question}
          answerData={answerData}
          onChange={onChange}
          editable={editable}
        />
      </div>
    );
  };

  render() {
    const {
      question,
      answerData,
      visible,
      displayHamburger,
      patientAnswerIds,
      assessment,
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
      [styles.highRiskAnswer]: highRiskAnswer,
      [styles.hidden]: !visible,
      [styles.multiSelect]: question.answerType === 'multiselect',
      [styles.border]: !!assessment,
    });

    const hamburger = displayHamburger ? (
      <QuestionMenu patientAnswerIds={patientAnswerIds || []} questionId={question.id} />
    ) : null;

    return (
      <div className={questionStyles}>
        <div className={styles.questionHeader}>
          <FormLabel text={question.title} className={styles.questionTitle} />
          {hamburger}
        </div>
        {this.renderAnswers()}
      </div>
    );
  }
}
