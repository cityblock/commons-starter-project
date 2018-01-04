import * as React from 'react';
import { FullAnswerFragment, FullQuestionFragment } from '../../graphql/types';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';

interface IProps {
  currentAnswer: { id: string; value: string };
  editable: boolean;
  question: FullQuestionFragment;
  onChange: (
    questionId: string,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => any;
}

export default class DropdownAnswer extends React.Component<IProps, {}> {
  renderDropdownOption = (answer: FullAnswerFragment, index: number) => {
    return <Option key={`${answer.id}-${index}`} value={answer.id} label={answer.displayValue} />;
  };

  onDropdownChange = (id: string) => {
    const { question, onChange } = this.props;

    const chosenAnswer = (question.answers || []).find(answer => answer.id === id);

    if (chosenAnswer) {
      onChange(question.id, [{ answerId: chosenAnswer.id, value: chosenAnswer.value }]);
    }
  };

  render() {
    const { question, currentAnswer, editable } = this.props;
    const answers = question.answers || [];

    return (
      <Select
        value={currentAnswer ? currentAnswer.id : 'Select one'}
        onChange={event => this.onDropdownChange(event.currentTarget.value)}
        disabled={!editable}
        large={true}
      >
        <Option messageId="select.default" value="" disabled={true} />
        {answers.map(this.renderDropdownOption)}
      </Select>
    );
  }
}
