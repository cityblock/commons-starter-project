import React from 'react';
import { FullAnswerFragment, FullQuestionFragment } from '../../graphql/types';
import CheckboxGroup from '../../shared/library/checkbox-group/checkbox-group';
import DropdownAnswer from './dropdown-answer';
import FreeTextAnswer from './free-text-answer';
import MultiSelectAnswer from './multi-select-answer';
import RadioAnswer from './radio-answer';

interface IProps {
  question: FullQuestionFragment;
  editable: boolean;
  onChange: (
    question: FullQuestionFragment,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => any;
  answerData: Array<{
    id: string;
    value: string;
  }>;
}

export class QuestionAnswers extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.onClickMultiSelect = this.onClickMultiSelect.bind(this);
    this.renderMultiSelectItem = this.renderMultiSelectItem.bind(this);
  }

  onClickMultiSelect(value: string | number, answerId: string, isRemove: boolean) {
    const { question, onChange, answerData } = this.props;
    let newAnswerData: Array<{ answerId: string; value: string | number }> = [];
    if (answerData) {
      if (isRemove) {
        newAnswerData = answerData.filter(answer => answer.id !== answerId).map(answer => ({
          answerId: answer.id,
          value: answer.value,
        }));
      } else {
        const formattedAnswerData = answerData.map(answer => ({
          answerId: answer.id,
          value: answer.value,
        }));
        newAnswerData = [...formattedAnswerData, { answerId, value }];
      }

      onChange(question, newAnswerData);
    }
  }

  renderMultiSelectItem(multiSelectAnswer: FullAnswerFragment, index: number) {
    const { answerData, editable } = this.props;
    const answers = answerData || [];
    const selected = !!answers.find(answer => answer.id === multiSelectAnswer.id);

    return (
      <MultiSelectAnswer
        key={`${multiSelectAnswer.id}-${index}`}
        answer={multiSelectAnswer}
        onClick={this.onClickMultiSelect}
        selected={selected}
        editable={editable}
      />
    );
  }

  render() {
    const { question, answerData, onChange, editable } = this.props;
    const answers = question.answers || [];

    const currentAnswer = (answerData || [])[0];

    switch (question.answerType) {
      case 'dropdown':
        return (
          <DropdownAnswer
            currentAnswer={currentAnswer}
            question={question}
            onChange={onChange}
            editable={editable}
          />
        );
      case 'radio':
        return (
          <RadioAnswer
            currentAnswer={currentAnswer}
            question={question}
            onChange={onChange}
            editable={editable}
          />
        );
      case 'freetext':
        return (
          <FreeTextAnswer
            currentAnswer={currentAnswer}
            question={question}
            onChange={onChange}
            editable={editable}
          />
        );
      case 'multiselect':
        return <CheckboxGroup>{answers.map(this.renderMultiSelectItem)}</CheckboxGroup>;
      default:
        return <div>Invalid answer type</div>;
    }
  }
}

export default QuestionAnswers;
