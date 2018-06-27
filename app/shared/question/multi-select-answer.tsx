import React from 'react';
import { FullAnswer } from '../../graphql/types';
import CheckboxInput from '../library/checkbox-input/checkbox-input';

interface IProps {
  onClick: (value: string | number, answerId: string, isRemove: boolean) => any;
  answer: FullAnswer;
  editable: boolean;
  selected: boolean;
}

export default class MultiSelectAnswer extends React.Component<IProps, {}> {
  onChange = (): void => {
    const { editable, answer, onClick, selected } = this.props;
    if (editable) {
      onClick(answer.value, answer.id, selected);
    }
  };

  render() {
    const { answer, editable, selected } = this.props;

    return (
      <CheckboxInput
        inputId={`checkbox-${answer.id}`}
        value={answer.value}
        checked={selected}
        onChange={this.onChange}
        label={answer.displayValue}
        disabled={!editable}
      />
    );
  }
}
