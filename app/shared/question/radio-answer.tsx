import * as React from 'react';
import { FullAnswerFragment, FullQuestionFragment } from '../../graphql/types';
import RadioGroup from '../../shared/library/radio-group/radio-group';
import RadioInput from '../../shared/library/radio-input/radio-input';

interface IProps {
  editable: boolean;
  currentAnswer: { id: string; value: string };
  question: FullQuestionFragment;
  onChange: (
    questionId: string,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => any;
}

export default class RadioAnswer extends React.Component<IProps, {}> {
  renderRadioItem = (answer: FullAnswerFragment, index: number): JSX.Element => {
    const { question, currentAnswer, onChange, editable } = this.props;

    return (
      <RadioInput
        key={`${answer.id}-${index}`}
        value={answer.id}
        checked={!!currentAnswer && currentAnswer.id === answer.id}
        onChange={e => onChange(question.id, [{ answerId: answer.id, value: answer.value }])}
        label={answer.displayValue}
        disabled={!editable}
      />
    );
  };

  render(): JSX.Element {
    const { question } = this.props;
    const answers = question.answers || [];

    return <RadioGroup>{answers.map(this.renderRadioItem)}</RadioGroup>;
  }
}
