import classNames from 'classnames';
import { slice } from 'lodash';
import React from 'react';
import { FullAnswer, FullQuestion } from '../../graphql/types';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';
import FreeTextAnswer from './free-text-answer';
import styles from './patient-question.css';

interface IProps {
  currentAnswer: { id: string; value: string };
  editable: boolean;
  question: FullQuestion;
  onChange: (
    question: FullQuestion,
    answers: Array<{ answerId: string; value: string | number }>,
  ) => any;
}

export default class DropdownAnswer extends React.Component<IProps, {}> {
  renderDropdownOption = (answer: FullAnswer, index: number) => {
    return <Option key={`${answer.id}-${index}`} value={answer.id} label={answer.displayValue} />;
  };

  renderDropdownOptions = () => {
    const { question } = this.props;
    let answers = question.answers || [];

    // When created, the 'other' answer is order 0, so we need to move it to the end of the list
    if (question.otherTextAnswerId && answers.length) {
      answers = [...slice(answers, 1), answers[0]];
    }

    return answers.map(this.renderDropdownOption);
  };

  onDropdownChange = (id: string) => {
    const { question, onChange } = this.props;

    const chosenAnswer = (question.answers || []).find(answer => answer.id === id);

    if (chosenAnswer) {
      onChange(question, [{ answerId: chosenAnswer.id, value: chosenAnswer.value }]);
    }
  };

  renderFreeText = () => {
    const { question, currentAnswer, editable } = this.props;
    const { otherTextAnswerId } = question;
    const freeTextVisible =
      !!otherTextAnswerId && currentAnswer && currentAnswer.id === otherTextAnswerId;

    if (freeTextVisible) {
      return (
        <div className={classNames(styles.question, styles.otherTextAnswer)}>
          <FreeTextAnswer
            currentAnswer={currentAnswer}
            question={question}
            onChange={this.props.onChange}
            editable={editable}
            otherTextAnswer={true}
          />
        </div>
      );
    }
  };

  render() {
    const { currentAnswer, editable } = this.props;

    return (
      <div className={styles.fullWidth}>
        <Select
          value={currentAnswer ? currentAnswer.id : ''}
          onChange={event => this.onDropdownChange(event.currentTarget.value)}
          disabled={!editable}
          large={true}
        >
          <Option
            messageId={editable ? 'select.default' : 'select.disabled'}
            value=""
            disabled={true}
          />
          {this.renderDropdownOptions()}
        </Select>
        {this.renderFreeText()}
      </div>
    );
  }
}
