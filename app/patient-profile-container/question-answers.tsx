import * as classNames from 'classnames';
import * as React from 'react';
import { FullAnswerFragment, FullQuestionFragment } from '../graphql/types';
import * as styles from './css/risk-areas.css';
import DropdownAnswer from './dropdown-answer';
import FreeTextAnswer from './free-text-answer';
import MultiSelectAnswer from './multi-select-answer';
import RadioAnswer from './radio-answer';

interface IProps {
  question: FullQuestionFragment;
  onChange: (questionId: string, answerId: string, value: string | number) => any;
  answerData: {
    answers: Array<{
      id: string;
      value: string;
    }>;
  };
}

export class QuestionAnswers extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.onClickMultiSelect = this.onClickMultiSelect.bind(this);
    this.renderMultiSelectItem = this.renderMultiSelectItem.bind(this);
  }

  onClickMultiSelect(value: string | number, answerId: string) {
    const { question, onChange } = this.props;

    onChange(question.id, answerId, value);
  }

  renderMultiSelectItem(multiSelectAnswer: FullAnswerFragment, index: number) {
    const { answerData } = this.props;
    const answers = (answerData || {}).answers || [];
    const selected = !!answers.find(answer => answer.id === multiSelectAnswer.id);

    return (
      <MultiSelectAnswer
        key={`${multiSelectAnswer.id}-${index}`}
        answer={multiSelectAnswer}
        onClick={this.onClickMultiSelect}
        selected={selected}
        editable={true} />
    );
  }

  render() {
    const { question, answerData, onChange } = this.props;
    const answers = question.answers || [];

    const questionBodyStyles = classNames(styles.riskAssessmentQuestionBody, {
      [styles.noBottomPadding]:
        question.answerType === 'radio' || question.answerType === 'multiselect',
    });

    const defaultAnswerData = { answers: [] };
    const currentAnswer = (answerData || defaultAnswerData).answers[0];

    switch (question.answerType) {
      case 'dropdown':
        return (
          <DropdownAnswer
            currentAnswer={currentAnswer}
            question={question}
            onChange={onChange} />
        );
      case 'radio':
        return (
          <RadioAnswer
            currentAnswer={currentAnswer}
            question={question}
            onChange={onChange} />
        );
      case 'freetext':
        return (
          <FreeTextAnswer
            currentAnswer={currentAnswer}
            question={question}
            onChange={onChange} />
        );
      case 'multiselect':
        return (
          <div className={questionBodyStyles}>
            <div className={styles.multiSelectRow}>
              {answers.map(this.renderMultiSelectItem)}
            </div>
          </div>
        );
      default:
        return <div>Invalid answer type</div>;
    }
  }
}

export default QuestionAnswers;
